import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const { ids, action } = await req.json();
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "IDs requeridos" }, { status: 400 });
  }
  let result;
  switch (action) {
    case "publish":
      result = await Post.updateMany({ _id: { $in: ids } }, { status: "published" });
      break;
    case "draft":
      result = await Post.updateMany({ _id: { $in: ids } }, { status: "draft" });
      break;
    case "archive":
      result = await Post.updateMany({ _id: { $in: ids } }, { status: "archived" });
      break;
    case "delete":
      result = await Post.deleteMany({ _id: { $in: ids } });
      break;
    case "feature":
      result = await Post.updateMany({ _id: { $in: ids } }, { featured: true });
      break;
    case "unfeature":
      result = await Post.updateMany({ _id: { $in: ids } }, { featured: false });
      break;
    default:
      return NextResponse.json({ error: "Accion no valida" }, { status: 400 });
  }
  const count = 'modifiedCount' in result ? result.modifiedCount : result.deletedCount;
  return NextResponse.json({ message: `${action} aplicado`, modified: count });
}
