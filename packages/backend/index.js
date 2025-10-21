import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import fs from "fs";
import path from "path";
import appRoutes from "./routes/index.js";
import databaseService from "./services/databaseService.js";
import { corsOptions } from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize database connection
async function initializeDatabase() {
  try {
    await databaseService.connect();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}

// Check if credentials file exists (optional now with OAuth)
const credentialsPath = path.join(process.cwd(), "credentials.json");
if (!fs.existsSync(credentialsPath)) {
  console.warn("credentials.json file not found!");
  console.warn("This is optional when using OAuth authentication.");
  console.warn(
    "You can get credentials from: https://console.cloud.google.com/apis/credentials"
  );
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/api", appRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Gmail Summarizer API",
    version: "2.0.0",
    authentication: "OAuth 2.0 with Google",
    endpoints: {
      // Public endpoints
      health: "GET /api/gmail/health",
      authHealth: "GET /auth/health",

      // Authentication endpoints
      login: "POST /api/auth/google",
      callback: "GET /api/auth/google/callback",
      profile: "GET /api/auth/me",
      logout: "POST /api/auth/logout",
      refresh: "POST /api/auth/refresh",
      verify: "GET /api/auth/verify",

      // Protected Gmail endpoints (require authentication)
      labels: "GET /api/gmail/labels",
      labelById: "GET /api/gmail/labels/:labelId",
      emails: "GET /api/gmail/emails",
      emailById: "GET /api/gmail/emails/:emailId",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    message: "The requested endpoint does not exist",
  });
});

// Start server
async function startServer() {
  try {
    // Initialize database first
    await initializeDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Gmail API endpoints: http://localhost:${PORT}/api/gmail`);
      console.log(`Auth endpoints: http://localhost:${PORT}/auth`);
      console.log(`Health check: http://localhost:${PORT}/api/gmail/health`);
      console.log(`🔑 Login: http://localhost:${PORT}/auth/google`);
    });

    // Handle server errors
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Please try a different port or kill the process using this port.`
        );
        console.error(
          "You can kill the process with: lsof -ti:3002 | xargs kill -9"
        );
      } else {
        console.error("Server error:", error);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(async () => {
        await databaseService.disconnect();
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received, shutting down gracefully");
      server.close(async () => {
        await databaseService.disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();
