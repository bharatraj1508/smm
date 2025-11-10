import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "newsletter",
        "job_alert",
        "personal",
        "transactional",
        "promotional",
      ],
    },
    reason: String,
  },
  { _id: false }
);

const mailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    mailId: {
      type: String,
      required: true,
      unique: true,
    },
    threadId: {
      type: String,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
      index: true,
    },
    to: {
      type: [String],
      required: true,
      index: true,
    },
    snippet: String,
    body: String,
    labels: {
      type: [String],
      default: [],
    },
    date: Date,
    isRead: {
      type: Boolean,
      default: false,
    },
    lastSyncedAt: Date,
    category: {
      type: categorySchema,
      default: null,
    },
  },
  { timestamps: true }
);

// Optional: full-text search for subject/body
mailSchema.index({ subject: "text", body: "text" });

export default mongoose.model("Mail", mailSchema);
