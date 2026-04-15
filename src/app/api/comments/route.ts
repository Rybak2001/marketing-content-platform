import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  const filter: Record<string, string> = {};
  if (postId) filter.postId = postId;
  const comments = await Comment.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  const comment = await Comment.create({ ...body, userId: auth.id, userName: auth.name });
  return NextResponse.json(comment, { status: 201 });
}
