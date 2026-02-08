import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import { findUserByEmail, createUser, updateUserTokens, getUserById } from "./databaseService.js";

// Module-scoped state
let oauth2Client = null;

// Initialize Passport (called on module load for side effects)
const initializePassport = () => {
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
          let user = await findUserByEmail(profile.emails[0].value);
          if (user) {
            // Update existing user's tokens and add google id
            user = await updateUserTokens(user._id, {
              googleId: profile.id,
              accessToken,
              refreshToken,
              expiryDate: new Date(Date.now() + 3600 * 1000), // 1 hour from now
            });
          } else {
            // Create new user
            user = await createUser({
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
      },
    ),
  );

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

// Call on module load
initializePassport();

// Initialize OAuth2 client
export const initializeOAuth2Client = () => {
  oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI ||
      "http://localhost:3002/api/auth/google/callback",
  );
};

// Generate JWT token
export const generateJWTToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    name: user.name,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || "your-jwt-secret", {
    expiresIn: "24h",
  });
};

// Verify JWT token
export const verifyJWTToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-jwt-secret");
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// Refresh access token
export const refreshAccessToken = async (user) => {
  try {
    initializeOAuth2Client();

    const { refreshToken } = user.getDecryptedTokens();
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    // Update user's tokens in database
    await updateUserTokens(user._id, {
      accessToken: credentials.access_token,
      refreshToken: credentials.refresh_token || refreshToken,
      expiryDate: new Date(credentials.expiry_date),
      googleId: user.googleId,
    });

    return credentials.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new Error(`Failed to refresh access token: ${error.message}`);
  }
};

// Get valid access token (refresh if needed)
export const getValidAccessToken = async (user) => {
  try {
    const { accessToken, refreshToken } = user.getDecryptedTokens();

    // Check if token is expired (with 5 minute buffer)
    const now = new Date();
    const expiryTime = new Date(user.tokenExpiry);
    const bufferTime = 5 * 60 * 1000; // 5 minutes

    if (now.getTime() + bufferTime >= expiryTime.getTime()) {
      console.log("Access token expired, refreshing...");
      return await refreshAccessToken(user);
    }

    return accessToken;
  } catch (error) {
    console.error("Error getting valid access token:", error);
    throw new Error(`Failed to get valid access token: ${error.message}`);
  }
};

// Get authenticated Gmail client for user
export const getAuthenticatedGmailClient = async (user) => {
  try {
    initializeOAuth2Client();

    const accessToken = await getValidAccessToken(user);

    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    return google.gmail({ version: "v1", auth: oauth2Client });
  } catch (error) {
    console.error("Error getting authenticated Gmail client:", error);
    throw new Error(
      `Failed to get authenticated Gmail client: ${error.message}`,
    );
  }
};

// Logout user
export const logoutUser = async (userId) => {
  try {
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Error logging out user:", error);
    throw new Error(`Failed to logout user: ${error.message}`);
  }
};
