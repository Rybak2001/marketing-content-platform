import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  email: string;
  name: string;
  phone: string;
  company: string;
  source: string;
  tags: string[];
  audienceIds: string[];
  status: "subscribed" | "unsubscribed" | "bounced";
  metadata: Record<string, string>;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    source: { type: String, default: "manual" },
    tags: [{ type: String }],
    audienceIds: [{ type: String }],
    status: { type: String, enum: ["subscribed", "unsubscribed", "bounced"], default: "subscribed" },
    metadata: { type: Schema.Types.Mixed, default: {} },
    lastActivity: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
