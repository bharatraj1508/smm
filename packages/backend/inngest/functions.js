import { inngest } from "./client.js";
import Settings from "../models/settings.js";
import gmailService from "../services/gmailService.js";
import databaseService from "../services/databaseService.js";
import { emitToUser } from "../services/socketService.js";

export const syncEmails = inngest.createFunction(
  { id: "sync-emails-job" },
  { cron: "*/15 * * * *" }, // Run every 15 minutes
  async ({ step }) => {
    await step.run("sync-users", async () => {
      console.log("Starting scheduled email sync...");
      const settings = await Settings.find({ automaticSync: true }).populate(
        "userId",
      );

      let syncedCount = 0;
      for (const setting of settings) {
        if (setting.userId && setting.userId.isActive) {
          try {
            console.log(`Syncing for user: ${setting.userId.email}`);
            await gmailService.fetchNewEmails(setting.userId);
            syncedCount++;
          } catch (e) {
            console.error(`Failed to sync for ${setting.userId.email}`, e);
          }
        }
      }
      return { syncedCount };
    });
  },
);

export const syncEmailsForUser = inngest.createFunction(
  { id: "sync-emails-for-user" },
  { event: "sync/user.emails" },
  async ({ event, step }) => {
    const { userId } = event.data;
    if (!userId) {
      return { error: "No userId provided" };
    }

    await step.run("sync-single-user", async () => {
      try {
        const user = await databaseService.getUserById(userId);
        if (!user) {
          throw new Error("User not found");
        }
        console.log(`Manual sync triggered for user: ${user.email}`);
        const emails = await gmailService.fetchNewEmails(user);

        // Notify frontend via socket
        emitToUser(userId, "sync:complete", { count: emails.length });

        return { success: true, count: emails.length };
      } catch (error) {
        console.error(`Failed to sync for user ${userId}`, error);
        throw error;
      }
    });
  },
);
