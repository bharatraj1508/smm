import express from "express";
const router = express.Router();
import gmailRoutes from "./gmailRoutes.js";
import authRoutes from "./authRoutes.js";
import genAIRoutes from "./genAIRouter.js";

router.use("/auth", authRoutes);
router.use("/gmail", gmailRoutes);
router.use("/ai", genAIRoutes);

export default router;
