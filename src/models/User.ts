import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  active: boolean;
  avatar: string;
  bio: string;
  phone: string;
  timezone: string;
  language: string;
  preferences: {
    darkMode: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
    mentionAlerts: boolean;
  };
  apiKeys: { name: string; key: string; createdAt: Date; lastUsed?: Date }[];
  lastLogin?: Date;
  loginCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor", "viewer"], default: "viewer" },
    active: { type: Boolean, default: true },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    phone: { type: String, default: "" },
    timezone: { type: String, default: "America/La_Paz" },
    language: { type: String, default: "es" },
    preferences: {
      darkMode: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false },
      mentionAlerts: { type: Boolean, default: true },
    },
    apiKeys: [{ name: String, key: String, createdAt: { type: Date, default: Date.now }, lastUsed: Date }],
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
