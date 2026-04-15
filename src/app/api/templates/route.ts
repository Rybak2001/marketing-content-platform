import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Template from "@/models/Template";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const filter: Record<string, string> = {};
  if (category) filter.category = category;
  if (type) filter.type = type;
  const templates = await Template.find(filter).sort({ usageCount: -1 }).lean();
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  const template = await Template.create({ ...body, createdBy: auth.id });
  return NextResponse.json(template, { status: 201 });
}
