import { serve } from "inngest/express";
import { inngest } from "../inngest/client.js";
import { syncEmails, syncEmailsForUser } from "../inngest/functions.js";
import express from "express";

const router = express.Router();

router.use(
  "/",
  serve({ client: inngest, functions: [syncEmails, syncEmailsForUser] }),
);

export default router;
