import express from "express";
import passport from "passport";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { googleLogin, callback, logout, refresh, register, login } from "../controllers/authController.js";

const router = express.Router();

// Google OAuth login route
router.get("/google", googleLogin);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/login?error=auth_failed`,
    session: false,
  }),
  callback,
);

// Logout route
router.post("/logout", logout);

// Refresh token route
router.post("/refresh", authenticateToken, refresh);

router.post("/register", register);

router.post("/login", login);

export default router;
