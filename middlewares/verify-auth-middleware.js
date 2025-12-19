import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../config/constant.js";
import {
  verifyJwtToken,
  refreshJwtToken,
  isSessionActive,
} from "../service/auth-service.js";

const publicRoutes = ["/login", "/register", "/", "/refresh-token"];

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
    // For protected routes, redirect to login directly
    if (!publicRoutes.includes(req.path)) {
      return res.redirect("/login");
    }
    return next();
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
          res.clearCookie("access_token");
          res.clearCookie("refresh_token");

          if (!publicRoutes.includes(req.path)) {
            req.flash("error", "Session expired. Please login again.");
            return res.redirect("/login");
          }
          return next();
        }
      }

      req.user = decodedToken;
      return next();
    } catch (error) {
      // Access token is invalid/expired, try refresh token below
      res.clearCookie("access_token");
    }
  }

  if (refreshToken) {
    try {
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

      return next();
    } catch (error) {
      console.error(error);
      req.user = null;
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");

      if (!publicRoutes.includes(req.path)) {
        req.flash("error", "Session expired. Please login again.");
        return res.redirect("/login");
      }
    }
  }

  return next();
};
