import express from "express";
import {
  getLabels,
  getLabelById,
  healthCheck,
  getEmails,
  getEmailById,
  getEmailSyncCount,
  syncMails,
} from "../controllers/gmailController.js";
import {
  authenticateToken,
  rateLimit,
  requireGoogleId,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Health check route (no authentication required)
router.get("/health", healthCheck);

// Apply rate limiting to all authenticated routes
router.use(rateLimit(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// Protected routes (require authentication)
// Get all labels
router.get("/labels", authenticateToken, getLabels);

// Get a specific label by ID
router.get("/labels/:labelId", authenticateToken, getLabelById);

// Get emails with optional query
router.get(
  "/emails",
  authenticateToken,
  requireGoogleId,
  getEmails,
);

router.get(
  "/sync-count",
  authenticateToken,
  requireGoogleId,
  getEmailSyncCount,
);

router.post(
  "/initiate-sync",
  authenticateToken,
  requireGoogleId,
  syncMails,
);

// Get a specific email by ID
router.get(
  "/emails/:id",
  authenticateToken,
  requireGoogleId,
  getEmailById,
);

export default router;
