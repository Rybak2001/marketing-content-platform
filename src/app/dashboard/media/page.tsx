"use client";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import MediaGrid from "@/components/MediaGrid";
import EmptyState from "@/components/EmptyState";
import toast from "react-hot-toast";

export default function MediaPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (search) params.set("search", search);
    const q = params.toString();
    fetch(`/api/media${q ? `?${q}` : ""}`).then(r => r.ok ? r.json() : []).then(d => { setItems(d); setLoading(false); });
  }, [typeFilter, search]);

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/media/${id}`, { method: "DELETE" });
      setItems(items.filter(i => i._id !== id));
      toast.success("Media eliminada");
    } catch { toast.error("Error al eliminar"); }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Media" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Biblioteca de Media</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} archivos</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input value={search} onChange={e => { setSearch(e.target.value); setLoading(true); }} placeholder="Buscar archivos..." className="flex-1 min-w-[200px] px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
        <div className="flex gap-2">
          {["all", "image", "video", "document"].map(t => (
            <button key={t} onClick={() => { setTypeFilter(t); setLoading(true); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${typeFilter === t ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>
              {t === "all" ? "Todos" : t === "image" ? "🖼️ Imágenes" : t === "video" ? "🎬 Videos" : "📄 Docs"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon="🖼️" title="Sin archivos" description="Sube archivos multimedia para usar en tu contenido" />
      ) : (
        <MediaGrid items={items} onDelete={handleDelete} />
      )}
    </div>
  );
}
