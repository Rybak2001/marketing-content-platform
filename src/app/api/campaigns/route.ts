import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const filter: Record<string, string> = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  const campaigns = await Campaign.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(campaigns);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  const campaign = await Campaign.create({ ...body, createdBy: auth.id });
  return NextResponse.json(campaign, { status: 201 });
}
