import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Template from "@/models/Template";
import { requireAuth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const template = await Template.findById(params.id).lean();
  if (!template) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(template);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  const template = await Template.findByIdAndUpdate(params.id, body, { new: true });
  if (!template) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(template);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const template = await Template.findByIdAndDelete(params.id);
  if (!template) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ message: "Eliminado" });
}
