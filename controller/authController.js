import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../config/constant.js";
import {
  createUser,
  getUserByEmail,
  hashPassword,
  verifyPassword,
  generateJwtToken,
  generateRefreshToken,
  createSession,
  refreshJwtToken,
  verifyRefreshToken,
  deleteRefreshTokenById,
  deleteRefreshTokenByUserId,
} from "../service/auth-service.js";
import {
  validateLogin,
  validateRegistration,
} from "../validators/auth-validator.js";

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

    let isLoggedIn = req.cookies?.isLoggedIn ?? false;
    return res.render("index", { isLoggedIn });
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

  const user = await getUserByEmail(email);

  if (!user) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/login");
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/login");
  }

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

  res.redirect("/");
};

export const getRegisterPage = async (req, res) => {
  return res.render("register", {
    error: req.flash("error"),
    success: req.flash("success"),
    formData: {},
  });
};

export const submitRegistration = async (req, res) => {
  const { name, email, password, phone } = req.body;

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
      formData: { name, email, phone },
    });
  }

  try {
    const userExists = await getUserByEmail(email);

    if (userExists) {
      return res.render("register", {
        error: ["User already exists with this email"],
        success: [],
        formData: { name, email, phone },
      });
    }

    const hashedPassword = await hashPassword(password);
    await createUser({ name, email, password: hashedPassword });

    req.flash("success", "Registration successful! Please login.");
    return res.redirect("/login");
  } catch (error) {
    console.error(error);
    return res.render("register", {
      error: ["Something went wrong. Please try again."],
      success: [],
      formData: { name, email, phone },
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

  return res.status(200).json({
    success: true,
    message: "Logged out from all devices",
  });
};
