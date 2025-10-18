import express from "express";
const router = express.Router();
import gmailRoutes from "./gmailRoutes.js";
import authRoutes from "./authRoutes.js";

router.use("/auth", authRoutes);
router.use("/gmail", gmailRoutes);

export default router;
