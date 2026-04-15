import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Audience from "@/models/Audience";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const filter: Record<string, string> = {};
  if (status) filter.status = status;
  const audiences = await Audience.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(audiences);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  const audience = await Audience.create({ ...body, createdBy: auth.id });
  return NextResponse.json(audience, { status: 201 });
}
