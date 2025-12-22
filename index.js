import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import requestIp from "request-ip";

import { shortenRouter } from "./routes/page.routes.js";
import { verifyAuthToken } from "./middlewares/verify-auth-middleware.js";
import { loadSessionsIntoCache, getUserById } from "./service/auth-service.js";

const app = express();

// parse cookies
app.use(cookieParser());

// session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

// Get Ip address for user request
app.use(requestIp.mw());

// Serve static files before auth check (CSS, JS, images don't need authentication)
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// verify auth token for each request
app.use(verifyAuthToken);

app.use(async (req, res, next) => {
  if (req.user?.id) {
    // Fetch profile image for authenticated users
    const fullUser = await getUserById(req.user.id);
    res.locals.user = {
      ...req.user,
      profileImage: fullUser?.profileImage || null,
    };
  } else {
    res.locals.user = req.user;
  }
  return next();
});
app.set("view engine", "ejs");

app.use(shortenRouter);
// 404 handler - must be after all other routes
app.use((req, res) => {
  res.status(404).render("404");
});

const PORT = process.env.PORT || 3000;

// Load active sessions into cache before starting server
loadSessionsIntoCache()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to load sessions into cache:", error);
    process.exit(1);
  });
