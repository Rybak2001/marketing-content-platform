import mongoose, { Schema, Document } from "mongoose";

export interface ITemplate extends Document {
  name: string;
  description: string;
  category: string;
  type: "post" | "email" | "social" | "landing";
  content: string;
  thumbnail: string;
  variables: string[];
  isPublic: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, required: true },
    type: { type: String, enum: ["post", "email", "social", "landing"], required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    variables: [{ type: String }],
    isPublic: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Template || mongoose.model<ITemplate>("Template", TemplateSchema);
