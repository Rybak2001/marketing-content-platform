import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { requireAuth, requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const filter: Record<string, string> = {};
  if (category) filter.category = category;
  const settings = await Settings.find(filter).lean();
  const result: Record<string, unknown> = {};
  for (const s of settings) {
    const setting = s as unknown as { key: string; value: unknown };
    result[setting.key] = setting.value;
  }
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const body = await req.json();
  const updates = Object.entries(body).map(([key, value]) =>
    Settings.findOneAndUpdate({ key }, { value, updatedBy: auth.id }, { upsert: true, new: true })
  );
  await Promise.all(updates);
  return NextResponse.json({ message: "Configuracion actualizada" });
}
