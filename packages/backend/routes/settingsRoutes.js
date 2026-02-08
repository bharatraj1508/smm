import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getSettings, updateSettings } from "../controllers/settingsController.js";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getSettings);
router.put("/", updateSettings);

export default router;
