import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const post = await Post.findById(params.id).lean();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();
  const post = await Post.findByIdAndUpdate(params.id, {
    title: body.title,
    content: body.content,
    excerpt: body.excerpt,
    coverImage: body.coverImage,
    category: body.category,
    tags: body.tags,
    status: body.status,
    publishAt: body.publishAt,
  }, { new: true, runValidators: true });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const post = await Post.findByIdAndDelete(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
