import express from "express";
const router = express.Router();
import gmailRoutes from "./gmailRoutes.js";
import authRoutes from "./authRoutes.js";
import genAIRoutes from "./genAIRouter.js";
import settingsRoutes from "./settingsRoutes.js";
import inngestRoutes from "./inngestRoutes.js";

router.use("/auth", authRoutes);
router.use("/gmail", gmailRoutes);
router.use("/ai", genAIRoutes);
router.use("/settings", settingsRoutes);
router.use("/inngest", inngestRoutes);

export default router;
