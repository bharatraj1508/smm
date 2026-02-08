import passport from "passport";
import { generateJWTToken, logoutUser, refreshAccessToken } from "../services/authService.js";
import { StatusCode } from "status-code-enum";
import { findUserByEmail, createUser } from "../services/databaseService.js";

export const googleLogin = async (req, res, next) => {
  try {
    passport.authenticate("google", {
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/gmail.readonly",
      ],
      accessType: "offline",
    })(req, res, next);
  } catch (error) {
    console.error("Error initiating Google OAuth:", error);
    res.status(500).json({
      success: false,
      error: "OAuth initiation failed",
      message: "Failed to initiate Google authentication",
    });
  }
};

export const callback = async (req, res) => {
  try {
    const user = req.user;
    // Generate JWT token
    const token = generateJWTToken(user);
    // Get redirect URL from session
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/callback`;

    // Redirect to frontend with token
    const frontendUrl = new URL(redirectUrl);
    const userParamObject = {
      name: user.name,
      email: user.email,
      userId: user._id,
      googleId: user.googleId,
    };
    const userString = JSON.stringify(userParamObject);
    frontendUrl.searchParams.set("token", token);
    frontendUrl.searchParams.set("user", userString);
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
      }/login?error=callback_failed`,
    );
  }
};

export const logout = async (req, res) => {
  try {
    await logoutUser(req.userId);
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
};

export const refresh = async (req, res) => {
  try {
    const user = req.user;

    // Refresh the access token
    await refreshAccessToken(user);

    // Generate new JWT token
    const newToken = generateJWTToken(user);

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
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCode.ClientErrorBadRequest)
        .send({ message: "Email and Password fields are required." });
    }

    const user = await findUserByEmail(email);
    if (user) {
      return res
        .status(StatusCode.ClientErrorConflict)
        .send({ message: "This email has already been used." });
    }

    const newUser = await createUser({
      name,
      email,
      password,
    });
    const token = generateJWTToken(newUser);
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const userData = {
      name: newUser.name,
      email: newUser.email,
      userId: newUser._id,
    };
    res
      .status(StatusCode.SuccessOK)
      .send({ accessToken: token, user: userData });
  } catch (error) {
    console.log(error);
    res.status(StatusCode.ServerErrorInternal).send({ message: error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCode.ClientErrorBadRequest)
        .send({ message: "Email and Password fields are required." });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res
        .status(StatusCode.ClientErrorUnauthorized)
        .send({ message: "Invalid email or password." });
    }

    // If user registered via Google, only allow login if password exists
    if (user.googleId) {
      if (!user.password) {
        return res
          .status(StatusCode.ClientErrorUnauthorized)
          .send({ message: "Try login via google auth." });
      }
      // If there is a password (user set one after Google auth), allow login to continue below
    }

    // For non-Google users or users who set a password, check password
    const passwordCorrect = user.comparePassword(password);
    if (!passwordCorrect) {
      return res
        .status(StatusCode.ClientErrorUnauthorized)
        .send({ message: "Invalid email or password." });
    }
    const token = generateJWTToken(user);
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const userData = {
      name: user.name,
      email: user.email,
      userId: user._id,
      googleId: user.googleId,
    };
    res
      .status(StatusCode.SuccessOK)
      .send({ accessToken: token, user: userData });
  } catch (error) {
    console.log(error);
    res.status(StatusCode.ServerErrorInternal).send(error);
  }
};
