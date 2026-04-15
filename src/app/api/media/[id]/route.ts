import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Media from "@/models/Media";
import { requireAuth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const media = await Media.findById(params.id).lean();
  if (!media) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(media);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const media = await Media.findByIdAndDelete(params.id);
  if (!media) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ message: "Eliminado" });
}
