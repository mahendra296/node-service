import {
  ACCESS_TOKEN_EXPIRY,
  OAUTH_EXCHANGE_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../config/constant.js";
import {
  hashPassword,
  verifyPassword,
  generateJwtToken,
  generateRefreshToken,
  createSession,
  refreshJwtToken,
  verifyRefreshToken,
  deleteRefreshTokenById,
  deleteRefreshTokenByUserId,
  getSessionsByUserId,
} from "../service/auth-service.js";
import * as userService from "../service/user-service.js";
import {
  validateLogin,
  validateRegistration,
} from "../validators/auth-validator.js";
import {
  createVerificationCode,
  verifyOtpForLogin,
} from "../service/verification-service.js";
import {
  createGoogleAuthorizationURL,
  validateGoogleCallback,
  getGoogleUserInfo,
} from "../service/google-auth-service.js";
import { getCountryCodes } from "../service/profile-service.js";
import {
  createGithubAuthorizationURL,
  getGitHubEmails,
  getGitHubUserInfo,
  validateGithubCallback,
} from "../service/github-auth-service.js";

export const getDashboardPage = async (req, res) => {
  try {
    /* let isLoggedIn = req.headers.cookie;
    isLoggedIn = Boolean(
      isLoggedIn
        ?.split(";")
        ?.find((cookie) => cookie.trim().startsWith("isLoggedIn"))
        ?.split("=")[1]
    ); */
    console.log(req.cookies);

    return res.render("index");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error.");
  }
};

export const getLoginPage = async (req, res) => {
  try {
    return res.render("login", {
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error.", {
      error: req.flash("error"),
      success: req.flash("success"),
    });
  }
};

export const submitLogin = async (req, res) => {
  const validation = validateLogin(req.body);
  if (!validation.success) {
    // Safely access the first error with fallback
    const errorMessage =
      validation.error.errors?.[0]?.message ||
      validation.error.issues?.[0]?.message ||
      "Validation failed";
    req.flash("error", errorMessage);
    return res.redirect("/login");
  }

  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);

  if (!user) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/login");
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/login");
  }

  await setAccessAndRefreshToken(user, req, res);

  res.redirect("/");
};

export const getRegisterPage = async (req, res) => {
  const countryCodes = await getCountryCodes();
  return res.render("register", {
    error: req.flash("error"),
    success: req.flash("success"),
    formData: {},
    countryCodes,
  });
};

export const submitRegistration = async (req, res) => {
  const { firstName, lastName, gender, email, password, countryCode, phone } =
    req.body;

  const countryCodes = await getCountryCodes();

  // Validate input
  const validation = validateRegistration(req.body);
  if (!validation.success) {
    // Safely access the first error with fallback
    const errorMessage =
      validation.error.errors?.[0]?.message ||
      validation.error.issues?.[0]?.message ||
      "Validation failed";
    return res.render("register", {
      error: [errorMessage],
      success: [],
      formData: { firstName, lastName, gender, email, countryCode, phone },
      countryCodes,
    });
  }

  try {
    const userExists = await userService.getUserByEmail(email);

    if (userExists) {
      return res.render("register", {
        error: ["User already exists with this email"],
        success: [],
        formData: { firstName, lastName, gender, email, countryCode, phone },
        countryCodes,
      });
    }

    // Check if phone number already exists
    if (phone && countryCode) {
      const phoneExists = await userService.getUserByPhone(countryCode, phone);
      if (phoneExists) {
        return res.render("register", {
          error: ["Phone number is already registered"],
          success: [],
          formData: { firstName, lastName, gender, email, countryCode, phone },
          countryCodes,
        });
      }
    }

    const hashedPassword = await hashPassword(password);
    await userService.createUser({
      firstName,
      lastName,
      gender,
      email,
      countryCode,
      phone,
      password: hashedPassword,
    });

    req.flash("success", "Registration successful! Please login.");
    return res.redirect("/login");
  } catch (error) {
    console.error(error);
    return res.render("register", {
      error: ["Something went wrong. Please try again."],
      success: [],
      formData: { firstName, lastName, gender, email, countryCode, phone },
      countryCodes,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      const decodedToken = await verifyRefreshToken(refreshToken);
      if (decodedToken?.refreshTokenId) {
        await deleteRefreshTokenById(decodedToken.refreshTokenId);
      }
    }
  } catch (error) {
    // Token might be invalid/expired, but we still proceed with logout
    console.error("Error during logout:", error.message);
  }

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return res.redirect("/login");
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    const { newAccessToken, newRefreshToken, user } = await refreshJwtToken(
      refreshToken
    );

    req.user = user;

    const baseConfig = { httpOnly: true, secure: true };

    res.cookie("access_token", newAccessToken, {
      ...baseConfig,
      maxAge: ACCESS_TOKEN_EXPIRY,
    });

    res.cookie("refresh_token", newRefreshToken, {
      ...baseConfig,
      maxAge: REFRESH_TOKEN_EXPIRY,
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

export const logoutAllDevices = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  // Delete all refresh tokens for this user
  await deleteRefreshTokenByUserId(userId);

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  return res.redirect("/login");
};

export const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      req.flash("error", "Not authenticated");
      return res.redirect("/login");
    }

    // Verify the session belongs to the user
    const sessions = await getSessionsByUserId(userId);
    const sessionToDelete = sessions.find((s) => s.id === parseInt(sessionId));

    if (!sessionToDelete) {
      req.flash("error", "Session not found");
      return res.redirect("/profile");
    }

    // Delete the session
    await deleteRefreshTokenById(parseInt(sessionId));

    // If deleting current session, clear cookies and redirect to login
    if (req.user.refreshTokenId === parseInt(sessionId)) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return res.redirect("/login");
    }

    return res.redirect("/profile");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error.");
  }
};

export const getOtpLoginPage = async (req, res) => {
  try {
    return res.render("login-otp", {
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error.");
  }
};

export const sendLoginOtp = async (req, res) => {
  try {
    const { countryCode, phone } = req.body;

    if (!countryCode || !phone) {
      return res.status(400).json({
        success: false,
        message: "Country code and phone number are required",
      });
    }

    const user = await userService.getUserByPhone(countryCode, phone);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this phone number",
      });
    }

    await createVerificationCode(user.id, countryCode + phone, "SMS");

    return res.status(200).json({
      success: true,
      message: "OTP sent to your phone number",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

export const verifyLoginOtp = async (req, res) => {
  try {
    const { countryCode, phone, otp } = req.body;

    if (!countryCode || !phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Country code, phone number and OTP are required",
      });
    }

    const user = await userService.getUserByPhone(countryCode, phone);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this phone number",
      });
    }

    const result = await verifyOtpForLogin(user.id, otp);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // Create session and generate tokens
    const session = await createSession(user.id, {
      ip: req.clientIp,
      userAgent: req.headers["user-agent"],
    });

    const jwtToken = await generateJwtToken({
      id: user.id,
      name: user.name,
      email: user.email,
      refreshTokenId: session.id,
    });

    const refreshTokenValue = await generateRefreshToken({
      refreshTokenId: session.id,
    });

    const baseConfig = { httpOnly: true, secure: true };

    res.cookie("access_token", jwtToken, {
      ...baseConfig,
      maxAge: ACCESS_TOKEN_EXPIRY,
    });

    res.cookie("refresh_token", refreshTokenValue, {
      ...baseConfig,
      maxAge: REFRESH_TOKEN_EXPIRY,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      redirectUrl: "/",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};

// Google OAuth handlers
export const initiateGoogleLogin = async (req, res) => {
  try {
    if (req.user) redirect("/");

    const { url, state, codeVerifier } = await createGoogleAuthorizationURL();

    const cookieConfig = {
      httpOnly: true,
      secure: true,
      maxAge: OAUTH_EXCHANGE_EXPIRY,
      sameSite: "lax",
    };

    res.cookie("google_oauth_state", state, cookieConfig);
    res.cookie("google_code_verifier", codeVerifier, cookieConfig);

    return res.redirect(url.toString());
  } catch (error) {
    console.error("Error initiating Google login:", error);
    req.flash("error", "Failed to initiate Google login");
    return res.redirect("/login");
  }
};

export const handleGoogleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    const {
      google_oauth_state: storedState,
      google_code_verifier: storedCodeVerifier,
    } = req.cookies;

    // Validate state
    if (state !== storedState) {
      req.flash("error", "Invalid OAuth state");
      return res.redirect("/login");
    }

    // Exchange code for tokens
    const tokens = await validateGoogleCallback(code, storedCodeVerifier);
    console.log(tokens);

    const accessToken = tokens.accessToken();

    // Get user info from Google
    const googleUser = await getGoogleUserInfo(accessToken);
    const googleId = googleUser.id;

    // Check if OAuth account already exists
    let user = await userService.getUserWithAuthId("google", googleUser.email);

    // if user is exists but not linked with oauth
    if (user && !user.providerAccountId) {
      await userService.createOAuthAccount({
        userId: user.id,
        provider: "google",
        providerAccountId: googleId,
      });
    }

    if (!user) {
      user = await userService.createUserWithOauth({
        providerUser: googleUser,
        provider: "google",
        providerAccountId: googleId,
        email: googleUser.email,
      });
    }

    // Create session
    await setAccessAndRefreshToken(user, req, res);

    return res.redirect("/");
  } catch (error) {
    console.error("Error handling Google callback:", error);
    req.flash("error", "Google login failed");
    return res.redirect("/login");
  }
};

export const initiateGitHubLogin = async (req, res) => {
  try {
    if (req.user) redirect("/");

    const { url, state } = await createGithubAuthorizationURL();

    const cookieConfig = {
      httpOnly: true,
      secure: true,
      maxAge: OAUTH_EXCHANGE_EXPIRY,
      sameSite: "lax",
    };

    res.cookie("github_oauth_state", state, cookieConfig);

    return res.redirect(url.toString());
  } catch (error) {
    console.error("Error initiating github login:", error);
    req.flash("error", "Failed to initiate github login");
    return res.redirect("/login");
  }
};

export const handleGitHubCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    const { github_oauth_state: storedState } = req.cookies;

    // Validate state
    if (state !== storedState) {
      req.flash("error", "Invalid OAuth state");
      return res.redirect("/login");
    }

    // Exchange code for tokens
    const tokens = await validateGithubCallback(code);
    console.log(tokens);

    const accessToken = tokens.accessToken();

    // Get user info from Google
    const gitHubUser = await getGitHubUserInfo(accessToken);
    const gitHubUserEmails = await getGitHubEmails(accessToken);
    const email = gitHubUserEmails.filter((e) => e.primary)[0].email;
    const gitHubUserId = gitHubUser.id;

    // Check if OAuth account already exists
    let user = await userService.getUserWithAuthId("github", email);

    // if user is exists but not linked with oauth
    if (user && !user.providerAccountId) {
      await userService.createOAuthAccount({
        userId: user.id,
        provider: "github",
        providerAccountId: gitHubUserId,
      });
    }

    if (!user) {
      user = await userService.createUserWithOauth({
        providerUser: gitHubUser,
        provider: "github",
        providerAccountId: gitHubUserId,
        email: email,
      });
    }

    // Create session
    await setAccessAndRefreshToken(user, req, res);

    return res.redirect("/");
  } catch (error) {
    console.error("Error handling Github callback:", error);
    req.flash("error", "Github login failed");
    return res.redirect("/login");
  }
};

export const setAccessAndRefreshToken = async (user, req, res) => {
  // create session
  const session = await createSession(user.id, {
    ip: req.clientIp,
    userAgent: req.headers["user-agent"],
  });

  const jwtToken = await generateJwtToken({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    refreshTokenId: session.id,
  });

  const refreshTokenValue = await generateRefreshToken({
    refreshTokenId: session.id,
  });

  const baseConfig = { httpOnly: true, secure: true };

  res.cookie("access_token", jwtToken, {
    ...baseConfig,
    maxAge: ACCESS_TOKEN_EXPIRY,
  });

  res.cookie("refresh_token", refreshTokenValue, {
    ...baseConfig,
    maxAge: REFRESH_TOKEN_EXPIRY,
  });
};

