import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  action: string;
  entityType: "post" | "campaign" | "user" | "template" | "media" | "audience" | "contact" | "comment" | "settings";
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  details: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    entityName: { type: String, default: "" },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    details: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

ActivitySchema.index({ createdAt: -1 });
ActivitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);
