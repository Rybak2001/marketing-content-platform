import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import Campaign from "@/models/Campaign";
import Contact from "@/models/Contact";
import Template from "@/models/Template";
import Audience from "@/models/Audience";
import Media from "@/models/Media";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();

  const [totalPosts, totalUsers, totalCampaigns, totalContacts, totalTemplates, totalAudiences, totalMedia, posts, activeCampaigns] = await Promise.all([
    Post.countDocuments(),
    User.countDocuments(),
    Campaign.countDocuments(),
    Contact.countDocuments(),
    Template.countDocuments(),
    Audience.countDocuments(),
    Media.countDocuments(),
    Post.find().lean(),
    Campaign.countDocuments({ status: "active" }),
  ]);

  const byStatus: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  let totalViews = 0;
  for (const p of posts) {
    const s = (p as Record<string, unknown>).status as string || "draft";
    const c = (p as Record<string, unknown>).category as string || "Sin categoría";
    byStatus[s] = (byStatus[s] || 0) + 1;
    byCategory[c] = (byCategory[c] || 0) + 1;
    const a = (p as Record<string, unknown>).analytics as Record<string, number> | undefined;
    if (a) totalViews += a.views || 0;
  }

  const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(10).select("title slug status category createdAt analytics").lean();

  return NextResponse.json({ totalPosts, totalUsers, totalCampaigns, totalContacts, totalTemplates, totalAudiences, totalMedia, activeCampaigns, totalViews, byStatus, byCategory, recentPosts });
}
