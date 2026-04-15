import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Audience from "@/models/Audience";
import { requireAuth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const audience = await Audience.findById(params.id).lean();
  if (!audience) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(audience);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  const audience = await Audience.findByIdAndUpdate(params.id, body, { new: true });
  if (!audience) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(audience);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const audience = await Audience.findByIdAndDelete(params.id);
  if (!audience) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ message: "Eliminado" });
}
