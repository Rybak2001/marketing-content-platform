import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const entityType = searchParams.get("entityType");
  const limit = parseInt(searchParams.get("limit") || "50");
  const filter: Record<string, string> = {};
  if (entityType) filter.entityType = entityType;
  const activities = await Activity.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  return NextResponse.json(activities);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  const activity = await Activity.create({ ...body, userId: auth.id, userName: auth.name });
  return NextResponse.json(activity, { status: 201 });
}
