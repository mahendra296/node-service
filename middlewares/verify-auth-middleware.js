import { verifyJwtToken } from "../service/auth-service.js";

const publicRoutes = ["/login", "/register", "/", "/refresh-token"];

export const verifyAuthToken = async (req, res, next) => {
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
      req.xhr ||
      req.headers.accept?.includes("application/json") ||
      req.headers["content-type"]?.includes("application/json");

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
};
