import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Campaign from "@/models/Campaign";
import User from "@/models/User";
import Contact from "@/models/Contact";
import Activity from "@/models/Activity";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") || "30");
  const since = new Date(Date.now() - days * 86400000);

  const [
    totalPosts, publishedPosts, draftPosts, totalCampaigns, activeCampaigns,
    totalUsers, totalContacts, recentActivities, posts, campaigns
  ] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ status: "published" }),
    Post.countDocuments({ status: "draft" }),
    Campaign.countDocuments(),
    Campaign.countDocuments({ status: "active" }),
    User.countDocuments(),
    Contact.countDocuments(),
    Activity.find().sort({ createdAt: -1 }).limit(10).lean(),
    Post.find({ status: "published" }).select("analytics category createdAt").lean(),
    Campaign.find({ status: { $in: ["active", "completed"] } }).select("metrics budget spent status").lean(),
  ]);

  let totalViews = 0, totalClicks = 0, totalShares = 0;
  const viewsByCategory: Record<string, number> = {};
  for (const p of posts) {
    const a = (p as Record<string, unknown>).analytics as Record<string, number> | undefined;
    if (a) {
      totalViews += a.views || 0;
      totalClicks += a.clicks || 0;
      totalShares += a.shares || 0;
    }
    const cat = (p as Record<string, unknown>).category as string || "Otro";
    viewsByCategory[cat] = (viewsByCategory[cat] || 0) + ((a?.views) || 0);
  }

  let totalBudget = 0, totalSpent = 0, totalRevenue = 0;
  for (const c of campaigns) {
    const cm = c as Record<string, unknown>;
    totalBudget += (cm.budget as number) || 0;
    totalSpent += (cm.spent as number) || 0;
    const m = cm.metrics as Record<string, number> | undefined;
    if (m) totalRevenue += m.revenue || 0;
  }

  const topPosts = await Post.find({ status: "published" }).sort({ "analytics.views": -1 }).limit(5).select("title analytics.views analytics.shares slug").lean();

  return NextResponse.json({
    overview: { totalPosts, publishedPosts, draftPosts, totalCampaigns, activeCampaigns, totalUsers, totalContacts },
    content: { totalViews, totalClicks, totalShares, viewsByCategory, topPosts },
    campaigns: { totalBudget, totalSpent, totalRevenue, roi: totalSpent > 0 ? Math.round((totalRevenue / totalSpent) * 100) : 0 },
    recentActivities,
    period: days,
  });
}
