import mongoose, { Schema, Document } from "mongoose";

export interface IAudience extends Document {
  name: string;
  description: string;
  type: "segment" | "list" | "custom";
  filters: { field: string; operator: string; value: string }[];
  contactCount: number;
  tags: string[];
  status: "active" | "archived";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const AudienceSchema = new Schema<IAudience>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["segment", "list", "custom"], default: "list" },
    filters: [{ field: String, operator: String, value: String }],
    contactCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    status: { type: String, enum: ["active", "archived"], default: "active" },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Audience || mongoose.model<IAudience>("Audience", AudienceSchema);
