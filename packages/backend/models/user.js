import crypto from "crypto";
import mongoose from "mongoose";

// Encryption configuration
const ALGORITHM = "aes-256-cbc";
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

// Encrypt function
function encrypt(text) {
  const iv = crypto.randomBytes(16); // 16 bytes IV
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// Decrypt function
function decrypt(encryptedText) {
  const [ivHex, encryptedData] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    googleId: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    tokenExpiry: { type: Date, required: true },
    profilePicture: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Pre-save middleware to encrypt tokens
userSchema.pre("save", function (next) {
  if (this.isModified("accessToken")) {
    this.accessToken = encrypt(this.accessToken);
  }
  if (this.isModified("refreshToken")) {
    this.refreshToken = encrypt(this.refreshToken);
  }
  next();
});

// Instance method to decrypt tokens
userSchema.methods.getDecryptedTokens = function () {
  return {
    accessToken: decrypt(this.accessToken),
    refreshToken: decrypt(this.refreshToken),
  };
};

// Static methods
userSchema.statics.findByGoogleId = function (googleId) {
  return this.findOne({ googleId, isActive: true });
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

export default mongoose.model("User", userSchema);
