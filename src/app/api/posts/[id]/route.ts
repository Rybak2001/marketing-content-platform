import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { getAuthUser } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const post = await Post.findById(params.id).lean();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();
  const wordCount = body.content ? body.content.split(/\s+/).filter(Boolean).length : undefined;
  const data: Record<string, unknown> = {};
  const fields = ["title", "content", "excerpt", "coverImage", "category", "tags", "status", "publishAt", "seo", "priority", "featured", "pinned", "order", "campaignId", "templateId"];
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  if (wordCount !== undefined) {
    data.wordCount = wordCount;
    data.readTime = Math.max(1, Math.round(wordCount / 200));
  }
  if (body.approval) data.approval = body.approval;
  const post = await Post.findByIdAndUpdate(params.id, data, { new: true, runValidators: true });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const post = await Post.findByIdAndDelete(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
