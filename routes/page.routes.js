import { Router } from "express";
import * as authController from "../controller/authController.js";
import * as profileController from "../controller/profileController.js";
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
router.post("/session/delete/:sessionId", authController.deleteSession);

// OTP Login routes
router.get("/login-otp", authController.getOtpLoginPage);
router.post("/send-login-otp", authController.sendLoginOtp);
router.post("/verify-login-otp", authController.verifyLoginOtp);

// Profile routes
router.get("/profile", profileController.getProfilePage);
router.post("/send-verification-code", profileController.sendVerificationCode);

router
  .route("/verify-email")
  .get(profileController.verifyEmailFromLink)
  .post(profileController.verifyEmailFromCode);

// Profile image upload
router.post("/upload-profile-image", profileController.uploadUserProfileImage);

// Update profile (firstName, lastName, gender)
router.post("/update-profile", profileController.updateProfile);

// Change password (for logged-in users)
router
  .route("/change-password")
  .get(profileController.getChangePasswordPage)
  .post(profileController.changePassword);

// Forgot/Reset password routes
router
  .route("/forgot-password")
  .get(profileController.getForgotPasswordPage)
  .post(profileController.sendResetPasswordLink);

router
  .route("/reset-password")
  .get(profileController.getResetPasswordPage)
  .post(profileController.resetPassword);

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
