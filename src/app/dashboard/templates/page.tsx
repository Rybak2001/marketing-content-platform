"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import TemplateCard from "@/components/TemplateCard";
import EmptyState from "@/components/EmptyState";
import { CardSkeleton } from "@/components/LoadingSkeleton";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const params = typeFilter !== "all" ? `?type=${typeFilter}` : "";
    fetch(`/api/templates${params}`).then(r => r.ok ? r.json() : []).then(d => { setTemplates(d); setLoading(false); });
  }, [typeFilter]);

  const types = ["all", "post", "email", "social", "landing"];
  const typeLabels: Record<string, string> = { all: "Todas", post: "Posts", email: "Email", social: "Social", landing: "Landing" };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Plantillas" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plantillas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{templates.length} plantillas</p>
        </div>
        <Link href="/dashboard/templates/new" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nueva Plantilla
        </Link>
      </div>

      <div className="flex gap-2">
        {types.map(t => (
          <button key={t} onClick={() => { setTypeFilter(t); setLoading(true); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${typeFilter === t ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"}`}>
            {typeLabels[t]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : templates.length === 0 ? (
        <EmptyState icon="📋" title="Sin plantillas" description="Crea plantillas reutilizables para tu contenido" actionLabel="Nueva Plantilla" actionHref="/dashboard/templates/new" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(t => <TemplateCard key={t._id} template={t} />)}
        </div>
      )}
    </div>
  );
}
