import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  postId: string;
  userId: string;
  userName: string;
  parentId?: string;
  mentions: string[];
  resolved: boolean;
  type: "comment" | "suggestion" | "approval";
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    postId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    parentId: { type: String },
    mentions: [{ type: String }],
    resolved: { type: Boolean, default: false },
    type: { type: String, enum: ["comment", "suggestion", "approval"], default: "comment" },
  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
