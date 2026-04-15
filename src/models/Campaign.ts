import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
  name: string;
  description: string;
  type: "email" | "social" | "ads" | "blog" | "seo" | "event";
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  channel: string;
  budget: number;
  spent: number;
  startDate?: Date;
  endDate?: Date;
  goals: { metric: string; target: number; current: number }[];
  tags: string[];
  createdBy: string;
  assignedTo: string[];
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    roi: number;
  };
  abTest?: {
    enabled: boolean;
    variants: { name: string; weight: number; views: number; conversions: number }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["email", "social", "ads", "blog", "seo", "event"], required: true },
    status: { type: String, enum: ["draft", "active", "paused", "completed", "cancelled"], default: "draft" },
    channel: { type: String, default: "" },
    budget: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    goals: [{ metric: String, target: Number, current: { type: Number, default: 0 } }],
    tags: [{ type: String }],
    createdBy: { type: String, required: true },
    assignedTo: [{ type: String }],
    metrics: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
      ctr: { type: Number, default: 0 },
      roi: { type: Number, default: 0 },
    },
    abTest: {
      enabled: { type: Boolean, default: false },
      variants: [{ name: String, weight: Number, views: { type: Number, default: 0 }, conversions: { type: Number, default: 0 } }],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", CampaignSchema);
