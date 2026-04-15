import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Contact from "@/models/Contact";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "posts";

  if (type === "posts") {
    const posts = await Post.find().select("title category status tags createdAt analytics author authorName").lean();
    const csv = ["Titulo,Categoria,Estado,Tags,Autor,Vistas,Clicks,Shares,Fecha"].concat(
      posts.map((p) => {
        const post = p as Record<string, unknown>;
        const a = (post.analytics as Record<string, number>) || {};
        return `"${post.title}","${post.category}","${post.status}","${(post.tags as string[] || []).join(";")}","${post.authorName || ""}",${a.views || 0},${a.clicks || 0},${a.shares || 0},${new Date(post.createdAt as string).toISOString().split("T")[0]}`;
      })
    ).join("\n");
    return new NextResponse(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=posts-export.csv" } });
  }

  if (type === "contacts") {
    const contacts = await Contact.find().lean();
    const csv = ["Nombre,Email,Telefono,Empresa,Fuente,Estado,Tags,Ultima Actividad"].concat(
      contacts.map((c) => {
        const contact = c as Record<string, unknown>;
        return `"${contact.name}","${contact.email}","${contact.phone || ""}","${contact.company || ""}","${contact.source || ""}","${contact.status}","${(contact.tags as string[] || []).join(";")}",${contact.lastActivity ? new Date(contact.lastActivity as string).toISOString().split("T")[0] : ""}`;
      })
    ).join("\n");
    return new NextResponse(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=contacts-export.csv" } });
  }

  return NextResponse.json({ error: "Tipo no valido" }, { status: 400 });
}
