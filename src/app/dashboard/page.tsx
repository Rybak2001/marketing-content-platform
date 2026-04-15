"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import MetricsCard from "@/components/MetricsCard";
import StatusBadge from "@/components/StatusBadge";
import ActivityTimeline from "@/components/ActivityTimeline";
import { CardSkeleton } from "@/components/LoadingSkeleton";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then(r => r.ok ? r.json() : null),
      fetch("/api/posts?limit=5&sort=createdAt&order=desc").then(r => r.ok ? r.json() : []),
      fetch("/api/activity?limit=8").then(r => r.ok ? r.json() : []),
    ]).then(([s, p, a]) => {
      setStats(s); setPosts(p); setActivities(a); setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Resumen general de tu plataforma</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/new" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nuevo Post
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard title="Total Posts" value={stats?.totalPosts || 0} icon="📝" color="indigo" subtitle={`${stats?.publishedPosts || 0} publicados`} />
        <MetricsCard title="Campañas Activas" value={stats?.activeCampaigns || 0} icon="📣" color="green" subtitle={`${stats?.totalCampaigns || 0} total`} />
        <MetricsCard title="Contactos" value={stats?.totalContacts || 0} icon="👤" color="blue" />
        <MetricsCard title="Vistas Totales" value={stats?.totalViews || 0} icon="👁️" color="violet" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Posts Recientes</h2>
            <Link href="/dashboard/new" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {posts.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">Sin posts</p>
            ) : posts.map((post: any) => (
              <Link key={post._id} href={`/dashboard/${post._id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
                    {post.featured && <span className="text-yellow-500 text-xs">⭐</span>}
                  </div>
                  <p className="text-xs text-gray-400">{post.category} · {new Date(post.createdAt).toLocaleDateString("es-BO", { day: "numeric", month: "short" })}</p>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <span className="text-xs text-gray-400">{post.analytics?.views || 0} vistas</span>
                  <StatusBadge status={post.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Actividad Reciente</h2>
          </div>
          <div className="p-4">
            {activities.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">Sin actividad</p>
            ) : (
              <ActivityTimeline activities={activities} />
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: "/dashboard/campaigns", icon: "📣", label: "Campañas", desc: `${stats?.totalCampaigns || 0} total` },
          { href: "/dashboard/templates", icon: "📋", label: "Plantillas", desc: `${stats?.totalTemplates || 0} disponibles` },
          { href: "/dashboard/media", icon: "🖼️", label: "Media", desc: `${stats?.totalMedia || 0} archivos` },
          { href: "/dashboard/analytics", icon: "📊", label: "Analíticas", desc: "Ver métricas" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition group">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
