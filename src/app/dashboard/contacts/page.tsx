"use client";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import ExportButton from "@/components/ExportButton";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    const q = params.toString();
    fetch(`/api/contacts${q ? `?${q}` : ""}`).then(r => r.ok ? r.json() : []).then(d => { setContacts(d); setLoading(false); });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Contactos" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contactos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{contacts.length} contactos</p>
        </div>
        <ExportButton type="contacts" />
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input value={search} onChange={e => { setSearch(e.target.value); setLoading(true); }} placeholder="Buscar por nombre o email..." className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
        </div>
        <div className="flex gap-2">
          {["all", "subscribed", "unsubscribed", "bounced"].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setLoading(true); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${statusFilter === s ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>
              {s === "all" ? "Todos" : s === "subscribed" ? "Suscritos" : s === "unsubscribed" ? "Desuscritos" : "Rebotados"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-gray-200 dark:bg-gray-800 rounded-lg" />)}</div>
      ) : contacts.length === 0 ? (
        <EmptyState icon="👤" title="Sin contactos" description="Los contactos aparecerán aquí cuando se registren" />
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Contacto</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Empresa</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Fuente</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Estado</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {contacts.map(c => (
                <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{c.name || "—"}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{c.company || "—"}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400 capitalize">{c.source || "—"}</td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">{(c.tags || []).slice(0, 2).map((t: string) => <span key={t} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">#{t}</span>)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
