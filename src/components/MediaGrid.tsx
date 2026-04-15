"use client";
import { useState } from "react";

interface MediaItem {
  _id: string;
  filename: string;
  url: string;
  type: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  alt?: string;
  createdAt?: string;
}

const typeIcons: Record<string, string> = { image: "🖼️", video: "🎬", document: "📄", other: "📎" };

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default function MediaGrid({ items, onSelect, onDelete }: { items: MediaItem[]; onSelect?: (item: MediaItem) => void; onDelete?: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item._id} onClick={() => { setSelected(item._id === selected ? null : item._id); onSelect?.(item); }}
            className={`group relative bg-white dark:bg-gray-900 rounded-xl border-2 overflow-hidden cursor-pointer transition hover:shadow-lg ${selected === item._id ? "border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800" : "border-gray-200 dark:border-gray-800"}`}>
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              {item.type === "image" ? (
                <img src={item.url} alt={item.alt || item.filename} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">{typeIcons[item.type] || "📎"}</span>
              )}
            </div>
            <div className="p-2">
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.filename}</p>
              <p className="text-[10px] text-gray-400">{item.size ? formatBytes(item.size) : item.type}</p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
              <button onClick={(e) => { e.stopPropagation(); setPreview(item); }} className="p-1 bg-white dark:bg-gray-800 rounded-md shadow text-xs" title="Ver">👁️</button>
              {onDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(item._id); }} className="p-1 bg-white dark:bg-gray-800 rounded-md shadow text-xs" title="Eliminar">🗑️</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="fixed inset-0 bg-black/70" />
          <div className="relative max-w-3xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70 transition">✕</button>
            {preview.type === "image" ? (
              <img src={preview.url} alt={preview.alt || preview.filename} className="max-h-[70vh] object-contain mx-auto" />
            ) : (
              <div className="p-12 text-center">
                <span className="text-6xl block mb-4">{typeIcons[preview.type]}</span>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{preview.filename}</p>
              </div>
            )}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between text-sm text-gray-500">
              <span>{preview.filename}</span>
              <span>{preview.size ? formatBytes(preview.size) : ""} {preview.width && preview.height ? `· ${preview.width}×${preview.height}` : ""}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
