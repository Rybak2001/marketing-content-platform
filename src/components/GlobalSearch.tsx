"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  _id: string;
  _type: string;
  title?: string;
  name?: string;
  slug?: string;
  status?: string;
  category?: string;
  email?: string;
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ posts: SearchResult[]; campaigns: SearchResult[]; templates: SearchResult[]; contacts: SearchResult[]; total: number }>({ posts: [], campaigns: [], templates: [], contacts: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults({ posts: [], campaigns: [], templates: [], contacts: [], total: 0 }); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) setResults(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { const t = setTimeout(() => search(query), 300); return () => clearTimeout(t); }, [query, search]);

  function navigate(item: SearchResult) {
    setOpen(false); setQuery("");
    switch (item._type) {
      case "post": router.push(`/dashboard/${item._id}`); break;
      case "campaign": router.push("/dashboard/campaigns"); break;
      case "template": router.push("/dashboard/templates"); break;
      case "contact": router.push("/dashboard/contacts"); break;
    }
  }

  const typeIcons: Record<string, string> = { post: "📝", campaign: "📣", template: "📋", contact: "👤" };
  const typeLabels: Record<string, string> = { post: "Post", campaign: "Campaña", template: "Plantilla", contact: "Contacto" };

  if (!open) return (
    <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      <span className="hidden sm:inline">Buscar...</span>
      <kbd className="hidden sm:inline text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar posts, campañas, templates, contactos..." className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" />
          <kbd className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">ESC</kbd>
        </div>
        {query.length >= 2 && (
          <div className="max-h-80 overflow-y-auto p-2">
            {loading ? (
              <div className="text-center py-8"><div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto" /></div>
            ) : results.total === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">Sin resultados para "{query}"</p>
            ) : (
              <>
                {(["posts", "campaigns", "templates", "contacts"] as const).map((group) => {
                  const items = results[group];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={group} className="mb-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">{typeLabels[group.slice(0, -1)] || group}</p>
                      {items.map((item) => (
                        <button key={item._id} onClick={() => navigate(item)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left">
                          <span>{typeIcons[item._type]}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title || item.name || item.email}</p>
                            <p className="text-xs text-gray-400">{item.category || item.status || ""}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
