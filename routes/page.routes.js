import { Router } from "express";
import * as authController from "../controller/authController.js";
import * as shortnerController from "../controller/shortnerControllerMySQL.js";

const router = Router();

router.get("/", authController.getDashboardPage);
// router.get("/login", pageController.getLoginPage);
router
  .route("/register")
  .get(authController.getRegisterPage)
  .post(authController.submitRegistration);

router
  .route("/login")
  .get(authController.getLoginPage)
  .post(authController.submitLogin);

router.get("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout-all-devices", authController.logoutAllDevices);
router.get("/profile", authController.getProfilePage);
router.post("/session/delete/:sessionId", authController.deleteSession);
router.post("/send-verification-code", authController.sendVerificationCode);
router.post("/verify-email", authController.verifyEmailCode);

// URL Shortener routes
router
  .route("/shortner")
  .get(shortnerController.getShortnerPage)
  .post(shortnerController.postShortner);

router.post("/delete/:shortCodeId", shortnerController.deleteShortLink);
router.get("/shortCode/:shortCode", shortnerController.redirectToShortLinks);

// Edit routes for URL shortener
router
  .route("/edit/:id")
  .get(shortnerController.getEditPage)
  .post(shortnerController.postEditShortLink);

export const shortenRouter = router;
