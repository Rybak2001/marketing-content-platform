import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
  filename: string;
  url: string;
  publicId: string;
  type: "image" | "video" | "document" | "other";
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  folder: string;
  alt: string;
  tags: string[];
  usedIn: string[];
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    type: { type: String, enum: ["image", "video", "document", "other"], default: "image" },
    mimeType: { type: String, default: "" },
    size: { type: Number, default: 0 },
    width: { type: Number },
    height: { type: Number },
    folder: { type: String, default: "general" },
    alt: { type: String, default: "" },
    tags: [{ type: String }],
    usedIn: [{ type: String }],
    uploadedBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
