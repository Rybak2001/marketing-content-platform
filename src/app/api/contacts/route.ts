import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (tag) filter.tags = tag;
  if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
  const contacts = await Contact.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(contacts);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  if (Array.isArray(body)) {
    const contacts = await Contact.insertMany(body, { ordered: false }).catch((e) => e.insertedDocs || []);
    return NextResponse.json({ inserted: Array.isArray(contacts) ? contacts.length : 0 }, { status: 201 });
  }
  const contact = await Contact.create(body);
  return NextResponse.json(contact, { status: 201 });
}
