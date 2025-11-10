import express from "express";
import genAiController from "../controllers/genAIController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use(authenticateToken);

router.get("/categorize-email/:emailId", genAiController.categorizeEmail);

export default router;
