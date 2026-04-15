"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Breadcrumbs from "@/components/Breadcrumbs";
import TagInput from "@/components/TagInput";
import SEOPanel from "@/components/SEOPanel";
import MarkdownPreview from "@/components/MarkdownPreview";

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [seo, setSeo] = useState<any>({});
  const [featured, setFeatured] = useState(false);
  const [priority, setPriority] = useState("medium");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);

    const body = {
      title: form.get("title"),
      content,
      excerpt: form.get("excerpt"),
      coverImage: form.get("coverImage") || "",
      category: form.get("category"),
      tags,
      status: form.get("status"),
      publishAt: form.get("publishAt") || null,
      seo,
      featured,
      priority,
    };

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success("Publicación creada");
      router.push("/dashboard");
      router.refresh();
    } else {
      setSaving(false);
      toast.error("Error al crear la publicación");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Nuevo Post" }]} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva Publicación</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
            <input name="title" required className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="Título de la publicación" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Extracto</label>
            <input name="excerpt" required className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="Breve descripción del artículo" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
              <select name="category" required className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                <option value="">Seleccionar</option>
                <option value="Marketing">Marketing</option>
                <option value="Redes Sociales">Redes Sociales</option>
                <option value="SEO">SEO</option>
                <option value="Email Marketing">Email Marketing</option>
                <option value="Branding">Branding</option>
                <option value="Contenido">Contenido</option>
                <option value="Analítica">Analítica</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
              <select name="status" className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="scheduled">Programado</option>
                <option value="review">En Revisión</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publicar el</label>
              <input name="publishAt" type="datetime-local" className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Etiquetas</label>
            <TagInput value={tags} onChange={setTags} suggestions={["marketing", "seo", "social-media", "email", "branding", "analytics", "contenido", "estrategia"]} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de Imagen de Portada</label>
            <input name="coverImage" type="url" className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="https://res.cloudinary.com/..." />
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">⭐ Marcar como destacado</span>
          </label>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
          <MarkdownPreview content={content} />
          <textarea value={content} onChange={e => setContent(e.target.value)} required rows={14} className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y font-mono" placeholder="Escribe el contenido de tu publicación aquí..." />
        </div>

        {/* SEO */}
        <SEOPanel value={seo} onChange={setSeo} />

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50">
            {saving ? "Guardando..." : "Crear Publicación"}
          </button>
          <button type="button" onClick={() => router.push("/dashboard")} className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
