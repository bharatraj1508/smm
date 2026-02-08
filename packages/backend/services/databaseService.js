import mongoose from "mongoose";
import User from "../models/user.js";
// Removed static import of MongoMemoryServer to avoid crashes in production

// Module-scoped state
let isConnected = false;

export const connect = async () => {
  try {
    await cleanup();
    await mongoose.set("strictQuery", true);

    if (process.env.DB_STATE === "memory") {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      process.env.MONGODB_URI = uri;
      global.__MONGOD__ = mongod;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB URI:", process.env.MONGODB_URI);

    // Handle nodemon restarts
    process.once("beforeExit", cleanup);
    isConnected = true;
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
    // Handle various termination signals
    ["SIGINT", "SIGTERM", "SIGUSR2"].forEach((signal) => {
      process.once(signal, async () => {
        try {
          await cleanup();
          process.exit(0);
        } catch (err) {
          console.error(`Error during ${signal} cleanup:`, err);
          process.exit(1);
        }
      });
    });
    isConnected = false;
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
};

export const cleanup = async () => {
  try {
    await mongoose.disconnect();
    if (global.__MONGOD__) {
      await global.__MONGOD__.stop();
      global.__MONGOD__ = null;
    }
  } catch (err) {
    console.error("Cleanup error:", err);
  }
};

// User CRUD operations
export const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

export const findUserByGoogleId = async (googleId) => {
  try {
    return await User.findByGoogleId(googleId);
  } catch (error) {
    console.error("Error finding user by Google ID:", error);
    throw new Error(`Failed to find user: ${error.message}`);
  }
};

export const findUserByEmail = async (email) => {
  try {
    return await User.findByEmail(email);
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error(`Failed to find user: ${error.message}`);
  }
};

export const updateUserTokens = async (userId, tokens) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.accessToken = tokens.accessToken;
    if (tokens.refreshToken) {
      user.refreshToken = tokens.refreshToken;
    }
    user.tokenExpiry = tokens.expiryDate;
    user.googleId = tokens.googleId;

    await user.save();
    return user;
  } catch (error) {
    console.error("Error updating user tokens:", error);
    throw new Error(`Failed to update user tokens: ${error.message}`);
  }
};

export const deactivateUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.isActive = false;
    await user.save();
    return user;
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw new Error(`Failed to deactivate user: ${error.message}`);
  }
};

export const getUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

// Export isConnected getter for external use
export const getIsConnected = () => isConnected;
