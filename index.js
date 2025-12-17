import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import requestIp from "request-ip";

import { shortenRouter } from "./routes/page.routes.js";
import { verifyAuthToken } from "./middlewares/verify-auth-middleware.js";

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

// verify auth token for each request
app.use(verifyAuthToken);

app.use((req, res, next) => {
  res.locals.user = req.user;
  return next();
});
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(shortenRouter);
// 404 handler - must be after all other routes
app.use((req, res) => {
  res.status(404).render("404");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
