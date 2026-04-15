import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";
  const filter: Record<string, unknown> = { userId: auth.id };
  if (unreadOnly) filter.read = false;
  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50).lean();
  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  const notification = await Notification.create(body);
  return NextResponse.json(notification, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  if (body.markAllRead) {
    await Notification.updateMany({ userId: auth.id, read: false }, { read: true });
    return NextResponse.json({ message: "Todas marcadas como leidas" });
  }
  if (body.id) {
    await Notification.findByIdAndUpdate(body.id, { read: true });
    return NextResponse.json({ message: "Marcada como leida" });
  }
  return NextResponse.json({ error: "Accion no valida" }, { status: 400 });
}
