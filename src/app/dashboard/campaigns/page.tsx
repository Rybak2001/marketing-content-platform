"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CampaignCard from "@/components/CampaignCard";
import EmptyState from "@/components/EmptyState";
import { CardSkeleton } from "@/components/LoadingSkeleton";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const params = filter !== "all" ? `?status=${filter}` : "";
    fetch(`/api/campaigns${params}`).then(r => r.ok ? r.json() : []).then(d => { setCampaigns(d); setLoading(false); });
  }, [filter]);

  const statusFilters = ["all", "draft", "active", "paused", "completed", "cancelled"];
  const statusLabels: Record<string, string> = { all: "Todas", draft: "Borrador", active: "Activas", paused: "Pausadas", completed: "Completadas", cancelled: "Canceladas" };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Campañas" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campañas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{campaigns.length} campañas</p>
        </div>
        <Link href="/dashboard/campaigns/new" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nueva Campaña
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusFilters.map(s => (
          <button key={s} onClick={() => { setFilter(s); setLoading(true); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${filter === s ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"}`}>
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : campaigns.length === 0 ? (
        <EmptyState icon="📣" title="Sin campañas" description="Crea tu primera campaña de marketing" actionLabel="Nueva Campaña" actionHref="/dashboard/campaigns/new" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map(c => <CampaignCard key={c._id} campaign={c} />)}
        </div>
      )}
    </div>
  );
}
