import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../config/constant.js";
import {
  verifyJwtToken,
  refreshJwtToken,
  isSessionActive,
} from "../service/auth-service.js";

const publicRoutes = [
  "/login",
  "/login-otp",
  "/register",
  "/",
  "/refresh-token",
  "/send-login-otp",
  "/verify-login-otp",
  "/contact",
  "/about",
  "/forgot-password",
  "/reset-password",
  "/auth/google",
  "/auth/google/callback",
  "/auth/github",
  "/auth/github/callback",
];

/* export const verifyAuthToken = async (req, res, next) => {
  const token = req.cookies?.access_token;
  const refreshToken = req.cookies?.refresh_token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decodedToken = await verifyJwtToken(token);
    req.user = decodedToken;
  } catch (error) {
    req.user = null;
    res.clearCookie("access_token");

    // Check if this is an API request (expects JSON)
    const isApiRequest =
      (req.xhr ||
        req.headers.accept?.includes("application/json") ||
        req.headers["content-type"]?.includes("application/json")) ??
      false;

    // If refresh token exists and it's an API request, signal to refresh
    if (refreshToken && isApiRequest && !publicRoutes.includes(req.path)) {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    // For browser requests, clear cookies and redirect
    res.clearCookie("isLoggedIn");
    if (!publicRoutes.includes(req.path)) {
      req.flash("error", "Session expired. Please login again.");
      return res.redirect("/login");
    }
  }

  return next();
}; */

export const verifyAuthToken = async (req, res, next) => {
  const accessToken = req.cookies?.access_token;
  const refreshToken = req.cookies?.refresh_token;

  if (!accessToken && !refreshToken) {
    req.user = null;
    // Allow public routes to proceed
    if (isPublicRoute(req.path)) {
      return next();
    }

    // Redirect to login for protected routes
    req.flash("error", "Please login to continue.");
    return res.redirect("/login");
  }

  if (accessToken) {
    try {
      const decodedToken = await verifyJwtToken(accessToken);

      // Verify the session still exists using in-memory cache (O(1) lookup)
      // This ensures logout from all devices works immediately without DB call
      if (decodedToken.refreshTokenId) {
        if (!isSessionActive(decodedToken.refreshTokenId)) {
          // Session was invalidated (user logged out from all devices)
          req.user = null;
          clearAuthCookies(res);

          if (isPublicRoute(req.path)) {
            return next();
          }

          req.flash("error", "Session expired. Please login again!");
          return res.redirect("/login");
        }
      }

      req.user = decodedToken;
      return next();
    } catch (error) {
      // Access token is invalid/expired, try refresh token below
      console.error("Access Token error : ", error);
      res.clearCookie("access_token");
    }
  }

  if (refreshToken) {
    try {
      const { newAccessToken, newRefreshToken, user } = await refreshJwtToken(
        refreshToken
      );
      req.user = user;

      setAuthCookies(res, newAccessToken, newRefreshToken);

      return next();
    } catch (error) {
      console.error("Refresh Token error : ", error);
      req.user = null;
      clearAuthCookies(res);

      if (isPublicRoute(req.path)) {
        return next();
      }

      req.flash("error", "Session expired. Please login again.");
      return res.redirect("/login");
    }
  }

  return next();
};

const isPublicRoute = (path) => {
  return publicRoutes.some((route) => {
    // Exact match
    if (route === path) return true;

    // Pattern match for dynamic routes (e.g., /api/*)
    if (route.endsWith("/*")) {
      const baseRoute = route.slice(0, -2);
      return path.startsWith(baseRoute);
    }

    return false;
  });
};

// Use this middleware for routes that absolutely require authentication
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    req.flash("error", "Authentication required.");
    return res.redirect("/login");
  }
  next();
};

// Middleware to require specific roles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      req.flash("error", "Authentication required.");
      return res.redirect("/login");
    }

    if (!roles.includes(req.user.role)) {
      req.flash("error", "You don't have permission to access this resource.");
      return res.redirect("/");
    }

    next();
  };
};

// ==================== Helper Functions ====================

const setAuthCookies = (res, accessToken, refreshToken) => {
  const baseConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    secure: true,
  };

  res.cookie("access_token", accessToken, {
    ...baseConfig,
    maxAge: ACCESS_TOKEN_EXPIRY,
  });

  res.cookie("refresh_token", refreshToken, {
    ...baseConfig,
    maxAge: REFRESH_TOKEN_EXPIRY,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
};
