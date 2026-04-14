import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  const filter: Record<string, string> = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const post = await Post.create({
    title: body.title,
    slug: slugify(body.title) + "-" + Date.now().toString(36),
    content: body.content,
    excerpt: body.excerpt,
    coverImage: body.coverImage || "",
    category: body.category,
    tags: body.tags || [],
    status: body.status || "draft",
    publishAt: body.publishAt || null,
  });
  return NextResponse.json(post, { status: 201 });
}
