import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Media from "@/models/Media";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const folder = searchParams.get("folder");
  const search = searchParams.get("search");
  const filter: Record<string, unknown> = {};
  if (type) filter.type = type;
  if (folder) filter.folder = folder;
  if (search) filter.$or = [{ filename: { $regex: search, $options: "i" } }, { alt: { $regex: search, $options: "i" } }, { tags: { $regex: search, $options: "i" } }];
  const media = await Media.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  const media = await Media.create({ ...body, uploadedBy: auth.id });
  return NextResponse.json(media, { status: 201 });
}
