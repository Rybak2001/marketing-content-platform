import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { requireAuth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const contact = await Contact.findById(params.id).lean();
  if (!contact) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(contact);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  const contact = await Contact.findByIdAndUpdate(params.id, body, { new: true });
  if (!contact) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(contact);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const contact = await Contact.findByIdAndDelete(params.id);
  if (!contact) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ message: "Eliminado" });
}
