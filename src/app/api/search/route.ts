import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Campaign from "@/models/Campaign";
import Template from "@/models/Template";
import Contact from "@/models/Contact";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q || q.length < 2) return NextResponse.json({ error: "Busqueda muy corta" }, { status: 400 });

  const regex = { $regex: q, $options: "i" };
  const [posts, campaigns, templates, contacts] = await Promise.all([
    Post.find({ $or: [{ title: regex }, { content: regex }, { tags: regex }] }).select("title slug status category").limit(10).lean(),
    Campaign.find({ $or: [{ name: regex }, { description: regex }, { tags: regex }] }).select("name status type").limit(5).lean(),
    Template.find({ $or: [{ name: regex }, { description: regex }] }).select("name category type").limit(5).lean(),
    Contact.find({ $or: [{ name: regex }, { email: regex }, { company: regex }] }).select("name email company").limit(5).lean(),
  ]);

  return NextResponse.json({
    posts: posts.map((p) => ({ ...p, _type: "post" })),
    campaigns: campaigns.map((c) => ({ ...c, _type: "campaign" })),
    templates: templates.map((t) => ({ ...t, _type: "template" })),
    contacts: contacts.map((c) => ({ ...c, _type: "contact" })),
    total: posts.length + campaigns.length + templates.length + contacts.length,
  });
}
