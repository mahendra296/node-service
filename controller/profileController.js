import {
  getSessionsByUserId,
  updateProfileImage,
  updateUserProfile,
  hashPassword,
  verifyPassword,
  updatePassword,
  isPasswordInHistory,
  addPasswordToHistory,
  getCountryCodes,
} from "../service/profile-service.js";
import * as userService from "../service/user-service.js";
import { uploadProfileImage } from "../middlewares/upload-middleware.js";
import fs from "fs";
import { validateVerificationCode } from "../validators/verification-validator.js";
import { validateChangePassword } from "../validators/password-validator.js";
import { validateEditProfile } from "../validators/profile-validator.js";
import {
  createVerificationCode,
  verifyCode,
  createResetPasswordCode,
  verifyResetPasswordCode,
} from "../service/verification-service.js";

// Profile Page
export const getProfilePage = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/login");
    }

    // Fetch full user data including createdAt
    const fullUser = await userService.getUserById(req.user.id);
    if (!fullUser) {
      return res.redirect("/login");
    }

    // Fetch all active sessions for the user
    const sessions = await getSessionsByUserId(req.user.id);
    const currentSessionId = req.user.refreshTokenId;

    return res.render("profile/profile", {
      profileUser: fullUser,
      sessions,
      currentSessionId,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error.");
  }
};

// Send Verification Code
export const sendVerificationCode = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    await createVerificationCode(userId, user.email, "EMAIL");

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send verification code",
    });
  }
};

// Verify Email from Code
export const verifyEmailFromCode = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const validation = validateVerificationCode(req.body);
    if (!validation.success) {
      const errorMessage =
        validation.error.errors?.[0]?.message ||
        validation.error.issues?.[0]?.message ||
        "Invalid verification code";
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const { code } = req.body;
    const result = await verifyCode(userId, code);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify email",
    });
  }
};

// Verify Email from Link
export const verifyEmailFromLink = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      req.flash("error", "Invalid verification link");
      return res.redirect("/login");
    }

    const user = await userService.getUserByEmail(decodeURIComponent(email));
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    if (user.isEmailVerified) {
      req.flash("success", "Email is already verified");
      return res.redirect("/login");
    }

    const result = await verifyCode(user.id, token);

    if (!result.success) {
      req.flash("error", result.message);
      return res.redirect("/login");
    }

    req.flash("success", "Email verified successfully! Please login.");
    return res.redirect("/login");
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to verify email");
    return res.redirect("/login");
  }
};

// Upload Profile Image
export const uploadUserProfileImage = (req, res) => {
  uploadProfileImage(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Failed to upload image",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      const userId = req.user?.id;
      if (!userId) {
        // Delete uploaded file if user is not authenticated
        if (req.file?.path) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      // Get current user to check for existing profile image
      const user = await getUserById(userId);

      // Delete old profile image if exists
      if (user?.profileImage) {
        const oldImagePath = `public${user.profileImage}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Store path relative to public folder
      const imagePath = `/uploads/profiles/${req.file.filename}`;
      await updateProfileImage(userId, imagePath);

      return res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        imagePath: imagePath,
      });
    } catch (error) {
      console.error(error);
      // Clean up uploaded file on error
      if (req.file?.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Failed to delete uploaded file:", unlinkError);
        }
      }
      return res.status(500).json({
        success: false,
        message: "Failed to upload profile image",
      });
    }
  });
};

// Change Password Page
export const getChangePasswordPage = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/login");
    }
    return res.render("profile/change-password", {
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error.");
  }
};

// Change Password (for logged-in users)
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      req.flash("error", "Not authenticated");
      return res.redirect("/login");
    }

    const validation = validateChangePassword(req.body);
    if (!validation.success) {
      const errorMessage =
        validation.error.errors?.[0]?.message ||
        validation.error.issues?.[0]?.message ||
        "Invalid input";
      req.flash("error", errorMessage);
      return res.redirect("/change-password");
    }

    const { currentPassword, newPassword } = validation.data;

    const user = await getUserById(userId);
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/change-password");
    }

    const isValidPassword = await verifyPassword(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      req.flash("error", "Current password is incorrect");
      return res.redirect("/change-password");
    }

    // Check if new password matches current password
    const isSameAsCurrent = await verifyPassword(newPassword, user.password);
    if (isSameAsCurrent) {
      req.flash(
        "error",
        "New password cannot be the same as your current password"
      );
      return res.redirect("/change-password");
    }

    // Check if new password was used in last 5 passwords
    const isInHistory = await isPasswordInHistory(userId, newPassword);
    if (isInHistory) {
      req.flash("error", "New password cannot be one of your last 5 passwords");
      return res.redirect("/change-password");
    }

    // Add current password to history before updating
    await addPasswordToHistory(userId, user.password);

    const hashedPassword = await hashPassword(newPassword);
    await updatePassword(userId, hashedPassword);

    req.flash("success", "Password changed successfully");
    return res.redirect("/profile");
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to change password");
    return res.redirect("/change-password");
  }
};

// Forgot Password Page
export const getForgotPasswordPage = async (req, res) => {
  try {
    return res.render("profile/forgot-password", {
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error.");
  }
};

// Send Reset Password Link
export const sendResetPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a reset link has been sent",
      });
    }

    await createResetPasswordCode(user.id, email);

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a reset link has been sent",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send reset link",
    });
  }
};

// Reset Password Page (verify link and show form)
export const getResetPasswordPage = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      req.flash("error", "Invalid reset link");
      return res.redirect("/forgot-password");
    }

    const user = await userService.getUserByEmail(decodeURIComponent(email));
    if (!user) {
      req.flash("error", "Invalid reset link");
      return res.redirect("/forgot-password");
    }

    const result = await verifyResetPasswordCode(user.id, token);
    if (!result.success) {
      req.flash("error", result.message);
      return res.redirect("/forgot-password");
    }

    return res.render("profile/reset-password", {
      error: req.flash("error"),
      success: req.flash("success"),
      token,
      email: decodeURIComponent(email),
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong");
    return res.redirect("/forgot-password");
  }
};

// Reset Password (set new password)
export const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset request",
      });
    }

    const result = await verifyResetPasswordCode(user.id, token);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    await updatePassword(user.id, hashedPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};

// Update Profile (firstName, lastName, gender)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const { firstName, lastName, gender } = req.body;

    if (!firstName || !lastName || !gender) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, and gender are required",
      });
    }

    if (!["male", "female", "other"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender value",
      });
    }

    await updateUserProfile(userId, { firstName, lastName, gender });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// Get Edit Profile Page
export const getEditProfilePage = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/login");
    }

    const fullUser = await getUserById(req.user.id);
    if (!fullUser) {
      return res.redirect("/login");
    }

    const countryCodes = await getCountryCodes();

    return res.render("profile/edit-profile", {
      profileUser: fullUser,
      countryCodes,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error.");
  }
};

// Submit Edit Profile
export const submitEditProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      req.flash("error", "Not authenticated");
      return res.redirect("/login");
    }

    const validation = validateEditProfile(req.body);
    if (!validation.success) {
      const errorMessage =
        validation.error.errors?.[0]?.message ||
        validation.error.issues?.[0]?.message ||
        "Invalid input";
      req.flash("error", errorMessage);
      return res.redirect("/profile/edit");
    }

    const { firstName, lastName, gender, countryCode, phone } = validation.data;

    // Check if phone number already exists for another user
    if (phone && countryCode) {
      const existingUser = await userService.getUserByPhone(countryCode, phone);
      if (existingUser && existingUser.id !== userId) {
        req.flash("error", "Phone number is already registered");
        return res.redirect("/profile/edit");
      }
    }

    await updateUserProfile(userId, { firstName, lastName, gender, countryCode, phone });

    req.flash("success", "Profile updated successfully");
    return res.redirect("/profile");
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to update profile");
    return res.redirect("/profile/edit");
  }
};
