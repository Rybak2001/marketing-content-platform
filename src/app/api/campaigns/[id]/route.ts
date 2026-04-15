import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import { requireAuth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const campaign = await Campaign.findById(params.id).lean();
  if (!campaign) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(campaign);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  const campaign = await Campaign.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
  if (!campaign) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(campaign);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const campaign = await Campaign.findByIdAndDelete(params.id);
  if (!campaign) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ message: "Eliminado" });
}
