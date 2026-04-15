"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Breadcrumbs from "@/components/Breadcrumbs";
import StatusBadge from "@/components/StatusBadge";
import MetricsCard from "@/components/MetricsCard";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function CampaignDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    fetch(`/api/campaigns/${id}`).then(r => r.ok ? r.json() : null).then(d => { setCampaign(d); setForm(d || {}); });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setCampaign(updated); setEditing(false);
      toast.success("Campaña actualizada");
    } catch { toast.error("Error al actualizar"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      toast.success("Campaña eliminada");
      router.push("/dashboard/campaigns");
    } catch { toast.error("Error al eliminar"); }
  }

  if (!campaign) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" /></div>;

  const m = campaign.metrics || {};

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Campañas", href: "/dashboard/campaigns" }, { label: campaign.name }]} />
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.name}</h1><StatusBadge status={campaign.status} /></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{campaign.type} · {campaign.channel || "General"}</p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition">{saving ? "Guardando..." : "Guardar"}</button>
              <button onClick={() => { setEditing(false); setForm(campaign); }} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancelar</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Editar</button>
              <button onClick={() => setShowDelete(true)} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition">Eliminar</button>
            </>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard title="Impresiones" value={m.impressions || 0} icon="👁️" color="blue" />
        <MetricsCard title="Clicks" value={m.clicks || 0} icon="👆" color="green" />
        <MetricsCard title="Conversiones" value={m.conversions || 0} icon="🎯" color="violet" />
        <MetricsCard title="ROI" value={`${(m.roi || 0).toFixed(1)}%`} icon="💰" color="orange" />
      </div>

      {/* Budget Progress */}
      {campaign.budget > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Presupuesto</span>
            <span className="text-sm text-gray-500">{(campaign.spent || 0).toLocaleString()} / {campaign.budget.toLocaleString()} BOB</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all" style={{ width: `${Math.min(100, ((campaign.spent || 0) / campaign.budget) * 100)}%` }} />
          </div>
        </div>
      )}

      {/* Detail / Edit Form */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        {editing ? (
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label><input value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
            <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label><textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm resize-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                <select value={form.status || "draft"} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm">
                  <option value="draft">Borrador</option><option value="active">Activa</option><option value="paused">Pausada</option><option value="completed">Completada</option><option value="cancelled">Cancelada</option>
                </select>
              </div>
              <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Presupuesto</label><input type="number" value={form.budget || 0} onChange={e => setForm({ ...form, budget: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div><h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Descripción</h3><p className="mt-1 text-gray-900 dark:text-white text-sm">{campaign.description || "Sin descripción"}</p></div>
            {campaign.goals?.length > 0 && (
              <div><h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Objetivos</h3>
                <ul className="mt-1 space-y-1">{campaign.goals.map((g: string, i: number) => <li key={i} className="text-sm text-gray-700 dark:text-gray-300">• {g}</li>)}</ul>
              </div>
            )}
            {campaign.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">{campaign.tags.map((t: string) => <span key={t} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs">#{t}</span>)}</div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog open={showDelete} title="Eliminar campaña" message={`¿Estás seguro de eliminar "${campaign.name}"?`} destructive onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </div>
  );
}
