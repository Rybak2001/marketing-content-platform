import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  status: "draft" | "published" | "scheduled" | "review" | "approved" | "archived";
  publishAt?: Date;
  author: string;
  authorName: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
    canonical: string;
  };
  analytics: {
    views: number;
    clicks: number;
    shares: number;
    avgReadTime: number;
    bounceRate: number;
  };
  versions: {
    content: string;
    title: string;
    savedAt: Date;
    savedBy: string;
  }[];
  approval: {
    submittedAt?: Date;
    submittedBy?: string;
    reviewedAt?: Date;
    reviewedBy?: string;
    status: "none" | "pending" | "approved" | "rejected";
    feedback?: string;
  };
  priority: "low" | "medium" | "high" | "urgent";
  campaignId?: string;
  templateId?: string;
  readTime: number;
  wordCount: number;
  featured: boolean;
  pinned: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: String, required: true },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "published", "scheduled", "review", "approved", "archived"],
      default: "draft",
    },
    publishAt: { type: Date },
    author: { type: String, default: "" },
    authorName: { type: String, default: "" },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }],
      ogImage: { type: String, default: "" },
      canonical: { type: String, default: "" },
    },
    analytics: {
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      avgReadTime: { type: Number, default: 0 },
      bounceRate: { type: Number, default: 0 },
    },
    versions: [{
      content: String,
      title: String,
      savedAt: { type: Date, default: Date.now },
      savedBy: String,
    }],
    approval: {
      submittedAt: Date,
      submittedBy: String,
      reviewedAt: Date,
      reviewedBy: String,
      status: { type: String, enum: ["none", "pending", "approved", "rejected"], default: "none" },
      feedback: String,
    },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    campaignId: { type: String },
    templateId: { type: String },
    readTime: { type: Number, default: 0 },
    wordCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PostSchema.index({ status: 1, createdAt: -1 });
PostSchema.index({ author: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ tags: 1 });

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
