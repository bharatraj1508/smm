import passport from "passport";
import authService from "../services/authService.js";
import { StatusCode } from "status-code-enum";
import databaseService from "../services/databaseService.js";

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
      // Set the JWT token as an HTTP-only cookie
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.redirect(frontendUrl.toString());
    } catch (error) {
      console.error("Error in OAuth callback:", error);
      res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/login?error=callback_failed`
      );
    }
  }

  async logout(req, res) {
    try {
      await authService.logoutUser(req.userId);
      res.cookie("accessToken", "NT", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
      });
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

  async register(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(StatusCode.ClientErrorBadRequest)
          .send({ message: "Email and Password fields are required." });
      }

      const user = await databaseService.findUserByEmail(email);
      if (user) {
        return res
          .status(StatusCode.ClientErrorConflict)
          .send({ message: "This email has already been used." });
      }

      const newUser = await databaseService.createUser({ email, password });
      const token = authService.generateJWTToken(newUser);
      res.status(StatusCode.SuccessOK).send({ accessToken: token });
    } catch (error) {
      console.log(error);
      res.status(StatusCode.ServerErrorInternal).send({ message: error });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(StatusCode.ClientErrorBadRequest)
          .send({ message: "Email and Password fields are required." });
      }

      const user = await databaseService.findUserByEmail(email);
      const passMatch = user.comparePassword(password);
      const isAuthenticated = user && passMatch;
      if (!isAuthenticated) {
        return res
          .status(StatusCode.ClientErrorUnauthorized)
          .send({ message: "Invalid email or password." });
      }
      const token = authService.generateJWTToken(user);
      res.status(StatusCode.SuccessOK).send({ accessToken: token });
    } catch (error) {
      console.log(error);
      res.status(StatusCode.ServerErrorInternal).send(error);
    }
  }
}

export default new AuthController();
