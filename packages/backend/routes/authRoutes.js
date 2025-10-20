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
  authController.callback
);

// Logout route
router.post("/logout", authController.logout);

// Refresh token route
router.post("/refresh", authenticateToken, authController.refresh);

router.post("/register", authController.register);

router.post("/login", authController.login);

export default router;
