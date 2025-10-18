import passport from "passport";
import authService from "../services/authService.js";

class AuthController {
  async googleLogin(req, res, next) {
    try {
      // Store the redirect URL in session if provided
      if (req.query.redirect) {
        req.session.redirectUrl = req.query.redirect;
      }

      passport.authenticate("google", {
        scope: [
          "profile",
          "email",
          "https://www.googleapis.com/auth/gmail.readonly",
        ],
        accessType: "offline",
        prompt: "consent",
      })(req, res, next);
    } catch (error) {
      console.error("Error initiating Google OAuth:", error);
      res.status(500).json({
        success: false,
        error: "OAuth initiation failed",
        message: "Failed to initiate Google authentication",
      });
    }
  }

  async callback(req, res) {
    try {
      const user = req.user;
      // Generate JWT token
      const token = authService.generateJWTToken(user);
      // Get redirect URL from session
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/callback`;

      // Clear redirect URL from session
      delete req.session.redirectUrl;

      // Redirect to frontend with token
      const frontendUrl = new URL(redirectUrl);
      frontendUrl.searchParams.set("token", token);

      res.redirect(frontendUrl.toString());
    } catch (error) {
      console.error("Error in OAuth callback:", error);
      res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/login?error=callback_failed`,
      );
    }
  }

  async me(req, res) {
    try {
      const userProfile = await authService.getUserProfile(req.userId);

      res.status(200).json({
        success: true,
        data: userProfile,
        message: "User profile retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting user profile:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to retrieve user profile",
      });
    }
  }

  async logout(req, res) {
    try {
      await authService.logoutUser(req.userId);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to logout",
      });
    }
  }

  async refresh(req, res) {
    try {
      const user = req.user;

      // Refresh the access token
      await authService.refreshAccessToken(user);

      // Generate new JWT token
      const newToken = authService.generateJWTToken(user);

      res.status(200).json({
        success: true,
        data: {
          token: newToken,
          expiresIn: "24h",
        },
        message: "Token refreshed successfully",
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to refresh token",
      });
    }
  }

  async health(req, res) {
    res.status(200).json({
      success: true,
      message: "Authentication service is running",
      timestamp: new Date().toISOString(),
      endpoints: {
        login: "GET /auth/google",
        callback: "GET /auth/google/callback",
        profile: "GET /auth/me",
        logout: "POST /auth/logout",
        refresh: "POST /auth/refresh",
        verify: "GET /auth/verify",
      },
    });
  }
}

export default new AuthController();
