import morgan from "morgan";
import logger from "../utils/logger.js";

// Custom tokens for morgan
morgan.token("client-ip", (req) => req.clientIp || req.ip);
morgan.token("user-id", (req) => (req.user?.id ? req.user.id : "anonymous"));
morgan.token("response-time-ms", (req, res) => {
  if (!req._startAt || !res._startAt) {
    return "-";
  }
  const ms =
    (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6;
  return ms.toFixed(3);
});

// Custom format string
const customFormat =
  ":client-ip :user-id :method :url :status :response-time-ms ms - :res[content-length]";

// Development format (colorful, detailed)
const devFormat = ":method :url :status :response-time ms - :res[content-length]";

// Create morgan middleware with winston stream
const httpLogger = morgan(
  process.env.NODE_ENV === "production" ? customFormat : devFormat,
  {
    stream: logger.stream,
    // Skip logging for static assets in production
    skip: (req, res) => {
      if (process.env.NODE_ENV === "production") {
        // Skip logging for static files
        const staticExtensions = [".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".woff", ".woff2"];
        return staticExtensions.some((ext) => req.url.endsWith(ext));
      }
      return false;
    },
  }
);

// Create a more detailed logger for specific routes
const detailedHttpLogger = morgan(
  (tokens, req, res) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number(tokens.status(req, res)),
      contentLength: tokens.res(req, res, "content-length"),
      responseTime: Number(tokens["response-time"](req, res)),
      clientIp: tokens["client-ip"](req, res),
      userId: tokens["user-id"](req, res),
      userAgent: tokens["user-agent"](req, res),
      referrer: tokens.referrer(req, res),
      timestamp: new Date().toISOString(),
    });
  },
  {
    stream: {
      write: (message) => {
        try {
          const data = JSON.parse(message);
          logger.http("HTTP Request", data);
        } catch {
          logger.http(message.trim());
        }
      },
    },
  }
);

export { httpLogger, detailedHttpLogger };
export default httpLogger;
