import express from "express";
import { categorizeEmail, generateMailSummary } from "../controllers/genAIController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use(authenticateToken);

router.get("/categorize-email/:emailId", categorizeEmail);
router.get("/summarize-email/:emailId", generateMailSummary);

export default router;
