import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { getAuthUser } from "@/lib/auth";

function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const author = searchParams.get("author");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") === "asc" ? 1 : -1;
  const limit = parseInt(searchParams.get("limit") || "100");

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (featured === "true") filter.featured = true;
  if (author) filter.author = author;
  if (search) filter.$or = [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }, { tags: { $regex: search, $options: "i" } }];

  const posts = await Post.find(filter).sort({ [sort]: order }).limit(limit).lean();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = getAuthUser(req);
  const body = await req.json();
  const wordCount = (body.content || "").split(/\s+/).filter(Boolean).length;
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
    author: user?.id || "",
    authorName: user?.name || "",
    seo: body.seo || {},
    priority: body.priority || "medium",
    readTime: Math.max(1, Math.round(wordCount / 200)),
    wordCount,
    featured: body.featured || false,
    pinned: body.pinned || false,
    analytics: { views: 0, clicks: 0, shares: 0, avgReadTime: 0, bounceRate: 0 },
  });
  return NextResponse.json(post, { status: 201 });
}
