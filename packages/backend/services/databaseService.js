import mongoose from "mongoose";
import User from "../models/user.js";

class DatabaseService {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      const mongoUri =
        process.env.MONGODB_URI || "mongodb://localhost:27017/summarize_mails";

      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      this.isConnected = true;
      console.log("Connected to MongoDB successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
    }
  }

  // User CRUD operations
  async createUser(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findUserByGoogleId(googleId) {
    try {
      return await User.findByGoogleId(googleId);
    } catch (error) {
      console.error("Error finding user by Google ID:", error);
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  async findUserByEmail(email) {
    try {
      return await User.findByEmail(email);
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  async updateUserTokens(userId, tokens) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      user.accessToken = tokens.accessToken;
      user.refreshToken = tokens.refreshToken;
      user.tokenExpiry = tokens.expiryDate;

      await user.save();
      return user;
    } catch (error) {
      console.error("Error updating user tokens:", error);
      throw new Error(`Failed to update user tokens: ${error.message}`);
    }
  }

  async deactivateUser(userId) {
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
  }

  async getUserById(userId) {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }
}

export default new DatabaseService();
