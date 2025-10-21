import mongoose from "mongoose";
import User from "../models/user.js";
import { MongoMemoryServer } from "mongodb-memory-server";

class DatabaseService {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      await this.cleanup();
      await mongoose.set("strictQuery", true);

      if (process.env.DB_STATE === "memory") {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        process.env.MONGODB_URI = uri;
        global.__MONGOD__ = mongod;
      }
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB URI:", process.env.MONGODB_URI);

      // Handle nodemon restarts
      process.once("beforeExit", this.cleanup);
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

  async cleanup() {
    try {
      await mongoose.disconnect();
      if (global.__MONGOD__) {
        await global.__MONGOD__.stop();
        global.__MONGOD__ = null;
      }
    } catch (err) {
      console.error("Cleanup error:", err);
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
      user.googleId = tokens.googleId;

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
