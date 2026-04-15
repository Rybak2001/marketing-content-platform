"use client";
import { useState } from "react";

interface SEOPanelProps {
  value: { metaTitle?: string; metaDescription?: string; keywords?: string[]; ogImage?: string; canonical?: string };
  onChange: (seo: SEOPanelProps["value"]) => void;
}

export default function SEOPanel({ value, onChange }: SEOPanelProps) {
  const [open, setOpen] = useState(false);
  const titleLen = (value.metaTitle || "").length;
  const descLen = (value.metaDescription || "").length;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition">
        <div className="flex items-center gap-2">
          <span>🔍</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">SEO</span>
          {value.metaTitle && <span className="w-2 h-2 bg-green-500 rounded-full" />}
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="p-4 space-y-4">
          {/* Preview */}
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Vista previa en buscador</p>
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium truncate">{value.metaTitle || "Título del post"}</p>
            <p className="text-green-700 dark:text-green-500 text-xs truncate">novatech.bo › post</p>
            <p className="text-xs text-gray-500 line-clamp-2">{value.metaDescription || "Descripción del post..."}</p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Meta Título</label>
              <span className={`text-xs ${titleLen > 60 ? "text-red-500" : titleLen > 50 ? "text-yellow-500" : "text-gray-400"}`}>{titleLen}/60</span>
            </div>
            <input type="text" value={value.metaTitle || ""} onChange={(e) => onChange({ ...value, metaTitle: e.target.value })} placeholder="Título optimizado para SEO" className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Meta Descripción</label>
              <span className={`text-xs ${descLen > 160 ? "text-red-500" : descLen > 140 ? "text-yellow-500" : "text-gray-400"}`}>{descLen}/160</span>
            </div>
            <textarea value={value.metaDescription || ""} onChange={(e) => onChange({ ...value, metaDescription: e.target.value })} placeholder="Descripción para resultados de búsqueda" rows={3} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm resize-none" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Palabras Clave (separadas por coma)</label>
            <input type="text" value={(value.keywords || []).join(", ")} onChange={(e) => onChange({ ...value, keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean) })} placeholder="marketing, digital, bolivia" className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">OG Image URL</label>
            <input type="text" value={value.ogImage || ""} onChange={(e) => onChange({ ...value, ogImage: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">URL Canónica</label>
            <input type="text" value={value.canonical || ""} onChange={(e) => onChange({ ...value, canonical: e.target.value })} placeholder="https://novatech.bo/blog/..." className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
