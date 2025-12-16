import {
  createUser,
  getUserByEmail,
  hashPassword,
  verifyPassword,
  generateJwtToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../service/auth-service.js";
import { validateRegistration } from "../validators/auth-validator.js";

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

  const jwtToken = await generateJwtToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });
  const refreshToken = await generateRefreshToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });
  res.cookie("isLoggedIn", true);
  res.cookie("access_token", jwtToken, { httpOnly: true });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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

export const logout = (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.clearCookie("isLoggedIn");
  return res.redirect("/login");
};

export const refreshToken = async (req, res) => {
  const token = req.cookies?.refresh_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No refresh token provided",
    });
  }

  try {
    const decoded = await verifyRefreshToken(token);

    const newAccessToken = await generateJwtToken({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    });

    res.cookie("access_token", newAccessToken, { httpOnly: true });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.clearCookie("isLoggedIn");

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};
