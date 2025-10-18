import express from "express";
import gmailController from "../controllers/gmailController.js";
import { authenticateToken, rateLimit } from "../middleware/authMiddleware.js";

const router = express.Router();

// Health check route (no authentication required)
router.get("/health", gmailController.healthCheck);

// Apply rate limiting to all authenticated routes
router.use(rateLimit(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// Protected routes (require authentication)
// Get all labels
router.get("/labels", authenticateToken, gmailController.getLabels);

// Get a specific label by ID
router.get("/labels/:labelId", authenticateToken, gmailController.getLabelById);

// Get emails with optional query
router.get("/emails", authenticateToken, gmailController.getEmails);

// Get a specific email by ID
router.get("/emails/:emailId", authenticateToken, gmailController.getEmailById);

export default router;
