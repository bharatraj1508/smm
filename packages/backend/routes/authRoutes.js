import express from "express";
import passport from "passport";
import { authenticateToken } from "../middleware/authMiddleware.js";
import authController from "../controllers/authController.js";

const router = express.Router();

// Google OAuth login route
router.get("/google", authController.googleLogin);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/login?error=auth_failed`,
    session: false,
  }),
  authController.callback,
);

// Get current user profile
router.get("/me", authenticateToken, authController.me);

// Logout route
router.post("/logout", authenticateToken, authController.logout);

// Refresh token route
router.post("/refresh", authenticateToken, authController.refresh);

// Health check for auth service
router.get("/health", authController.health);

export default router;
