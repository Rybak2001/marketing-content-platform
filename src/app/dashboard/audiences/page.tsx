"use client";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";

export default function AudiencesPage() {
  const [audiences, setAudiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audiences").then(r => r.ok ? r.json() : []).then(d => { setAudiences(d); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Audiencias" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audiencias</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{audiences.length} segmentos</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}</div>
      ) : audiences.length === 0 ? (
        <EmptyState icon="👥" title="Sin audiencias" description="Crea segmentos de audiencia para tus campañas" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {audiences.map(a => (
            <div key={a._id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{a.name}</h3>
                  <p className="text-xs text-gray-400 capitalize">{a.type}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
              {a.description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{a.description}</p>}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{a.contactCount || 0} contactos</span>
                <div className="flex flex-wrap gap-1">{(a.tags || []).slice(0, 2).map((t: string) => <span key={t} className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded">#{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
