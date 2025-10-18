import authService from "../services/authService.js";
import databaseService from "../services/databaseService.js";

// JWT Authentication Middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access token required",
        message: "Please provide a valid authentication token",
      });
    }

    // Verify JWT token
    const decoded = authService.verifyJWTToken(token);

    // Get user from database
    const user = await databaseService.getUserById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: "Invalid user",
        message: "User not found or inactive",
      });
    }

    // Add user to request object
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.message === "Invalid or expired token") {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
        message: "Token is invalid or expired. Please login again.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Authentication failed",
      message: "Internal authentication error",
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = authService.verifyJWTToken(token);
      const user = await databaseService.getUserById(decoded.userId);

      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

// Admin role middleware (for future use)
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please login to access this resource",
      });
    }

    // For now, all authenticated users are considered admins
    // In the future, you can add role-based access control
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    return res.status(500).json({
      success: false,
      error: "Authorization failed",
      message: "Internal authorization error",
    });
  }
};

// Rate limiting middleware (basic implementation)
const rateLimitMap = new Map();

export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, data] of rateLimitMap.entries()) {
      if (data.windowStart < windowStart) {
        rateLimitMap.delete(key);
      }
    }

    // Get or create client data
    let clientData = rateLimitMap.get(clientId);
    if (!clientData || clientData.windowStart < windowStart) {
      clientData = {
        requests: 0,
        windowStart: now,
      };
    }

    // Check rate limit
    if (clientData.requests >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: "Rate limit exceeded",
        message: `Too many requests. Limit: ${maxRequests} per ${
          windowMs / 1000 / 60
        } minutes`,
        retryAfter: Math.ceil((clientData.windowStart + windowMs - now) / 1000),
      });
    }

    // Increment request count
    clientData.requests++;
    rateLimitMap.set(clientId, clientData);

    // Add rate limit headers
    res.set({
      "X-RateLimit-Limit": maxRequests,
      "X-RateLimit-Remaining": maxRequests - clientData.requests,
      "X-RateLimit-Reset": new Date(
        clientData.windowStart + windowMs,
      ).toISOString(),
    });

    next();
  };
};

// CORS middleware for authentication
export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://localhost:8000",
      "http://127.0.0.1:8000",
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
