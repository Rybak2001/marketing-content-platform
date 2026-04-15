"use client";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import MetricsCard from "@/components/MetricsCard";
import DateRangePicker from "@/components/DateRangePicker";
import { CardSkeleton } from "@/components/LoadingSkeleton";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState({ from: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0], to: new Date().toISOString().split("T")[0] });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?from=${period.from}&to=${period.to}`).then(r => r.ok ? r.json() : null).then(d => { setData(d); setLoading(false); });
  }, [period]);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}</div>
    </div>
  );

  const o = data?.overview || {};
  const c = data?.content || {};
  const camp = data?.campaigns || {};

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Analíticas" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analíticas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Métricas de rendimiento</p>
        </div>
        <DateRangePicker value={period} onChange={setPeriod} />
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard title="Total Posts" value={o.totalPosts || 0} icon="📝" color="indigo" />
        <MetricsCard title="Total Vistas" value={o.totalViews || 0} icon="👁️" color="blue" />
        <MetricsCard title="Total Shares" value={o.totalShares || 0} icon="🔗" color="green" />
        <MetricsCard title="Tiempo Lectura Prom." value={`${(o.avgReadTime || 0).toFixed(1)} min`} icon="⏱️" color="violet" />
      </div>

      {/* Content Metrics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Por Categoría</h2>
          <div className="space-y-3">
            {(c.byCategory || []).map((item: any) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{item._id}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (item.count / (o.totalPosts || 1)) * 100)}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Por Estado</h2>
          <div className="space-y-3">
            {(c.byStatus || []).map((item: any) => {
              const colors: Record<string, string> = { published: "bg-green-500", draft: "bg-gray-400", scheduled: "bg-blue-500", review: "bg-yellow-500", archived: "bg-red-400" };
              return (
                <div key={item._id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{item._id}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors[item._id] || "bg-gray-400"}`} style={{ width: `${Math.min(100, (item.count / (o.totalPosts || 1)) * 100)}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">{item.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Top Posts por Vistas</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {(c.topPosts || []).map((post: any, i: number) => (
            <div key={post._id} className="flex items-center gap-4 px-5 py-3">
              <span className="text-lg font-bold text-gray-300 dark:text-gray-600 w-6">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
                <p className="text-xs text-gray-400">{post.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{(post.analytics?.views || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-400">vistas</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Metrics */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Campañas</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{camp.total || 0}</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{camp.active || 0}</p>
            <p className="text-xs text-gray-400">Activas</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{(camp.totalBudget || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-400">Presupuesto (BOB)</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{(camp.totalSpent || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-400">Gastado (BOB)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
