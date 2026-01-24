import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import settingsController from "../controllers/settingsController.js";

const router = express.Router();

router.use(authenticateToken);
router.get("/", settingsController.getSettings);
router.put("/", settingsController.updateSettings);

export default router;
