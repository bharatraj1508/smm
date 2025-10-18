import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import databaseService from "./databaseService.js";

class AuthService {
  constructor() {
    this.oauth2Client = null;
    this.initializePassport();
  }

  initializePassport() {
    // Configure Google OAuth Strategy
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL:
            process.env.GOOGLE_REDIRECT_URI ||
            "http://localhost:3002/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists
            let user = await databaseService.findUserByGoogleId(profile.id);

            if (user) {
              // Update existing user's tokens
              await databaseService.updateUserTokens(user._id, {
                accessToken,
                refreshToken,
                expiryDate: new Date(Date.now() + 3600 * 1000), // 1 hour from now
              });
            } else {
              // Create new user
              user = await databaseService.createUser({
                email: profile.emails[0].value,
                name: profile.displayName,
                googleId: profile.id,
                accessToken,
                refreshToken,
                tokenExpiry: new Date(Date.now() + 3600 * 1000), // 1 hour from now
                profilePicture: profile.photos[0]?.value,
              });
            }

            return done(null, user);
          } catch (error) {
            console.error("Error in Google OAuth strategy:", error);
            return done(error, null);
          }
        }
      )
    );

    // Serialize user for session
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    // Deserialize user from session
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await databaseService.getUserById(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  }

  // Initialize OAuth2 client
  initializeOAuth2Client() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI ||
        "http://localhost:3002/api/auth/google/callback"
    );
  }

  // Generate JWT token
  generateJWTToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      name: user.name,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || "your-jwt-secret", {
      expiresIn: "24h",
    });
  }

  // Verify JWT token
  verifyJWTToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || "your-jwt-secret");
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  // Refresh access token
  async refreshAccessToken(user) {
    try {
      this.initializeOAuth2Client();

      const { refreshToken } = user.getDecryptedTokens();
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();

      // Update user's tokens in database
      await databaseService.updateUserTokens(user._id, {
        accessToken: credentials.access_token,
        refreshToken: credentials.refresh_token || refreshToken,
        expiryDate: new Date(credentials.expiry_date),
      });

      return credentials.access_token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw new Error(`Failed to refresh access token: ${error.message}`);
    }
  }

  // Get valid access token (refresh if needed)
  async getValidAccessToken(user) {
    try {
      const { accessToken, refreshToken } = user.getDecryptedTokens();

      // Check if token is expired (with 5 minute buffer)
      const now = new Date();
      const expiryTime = new Date(user.tokenExpiry);
      const bufferTime = 5 * 60 * 1000; // 5 minutes

      if (now.getTime() + bufferTime >= expiryTime.getTime()) {
        console.log("Access token expired, refreshing...");
        return await this.refreshAccessToken(user);
      }

      return accessToken;
    } catch (error) {
      console.error("Error getting valid access token:", error);
      throw new Error(`Failed to get valid access token: ${error.message}`);
    }
  }

  // Get authenticated Gmail client for user
  async getAuthenticatedGmailClient(user) {
    try {
      this.initializeOAuth2Client();

      const accessToken = await this.getValidAccessToken(user);

      this.oauth2Client.setCredentials({
        access_token: accessToken,
      });

      return google.gmail({ version: "v1", auth: this.oauth2Client });
    } catch (error) {
      console.error("Error getting authenticated Gmail client:", error);
      throw new Error(
        `Failed to get authenticated Gmail client: ${error.message}`
      );
    }
  }

  // Logout user
  async logoutUser(userId) {
    try {
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Error logging out user:", error);
      throw new Error(`Failed to logout user: ${error.message}`);
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const user = await databaseService.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }
}

export default new AuthService();
