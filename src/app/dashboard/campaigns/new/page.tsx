"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Breadcrumbs from "@/components/Breadcrumbs";
import TagInput from "@/components/TagInput";

export default function NewCampaignPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", type: "email", channel: "", status: "draft",
    budget: 0, startDate: "", endDate: "", tags: [] as string[],
    goals: [] as string[], goalInput: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { goalInput, ...data } = form;
      const res = await fetch("/api/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Error creating campaign");
      toast.success("Campaña creada");
      router.push("/dashboard/campaigns");
    } catch { toast.error("Error al crear campaña"); }
    finally { setSaving(false); }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Campañas", href: "/dashboard/campaigns" }, { label: "Nueva" }]} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva Campaña</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm">
              <option value="email">Email</option><option value="social">Social</option><option value="ads">Ads</option><option value="blog">Blog</option><option value="seo">SEO</option><option value="event">Evento</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Canal</label>
            <input value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })} placeholder="Instagram, Facebook..." className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Presupuesto (BOB)</label>
            <input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: Number(e.target.value) })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm">
              <option value="draft">Borrador</option><option value="active">Activa</option><option value="paused">Pausada</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Inicio</label>
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fin</label>
            <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
          <TagInput value={form.tags} onChange={tags => setForm({ ...form, tags })} suggestions={["marketing", "social", "email", "ads", "seo", "branding"]} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Objetivos</label>
          <div className="flex gap-2 mb-2">
            <input value={form.goalInput} onChange={e => setForm({ ...form, goalInput: e.target.value })} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (form.goalInput.trim()) setForm({ ...form, goals: [...form.goals, form.goalInput.trim()], goalInput: "" }); } }} placeholder="Agregar objetivo..." className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
            <button type="button" onClick={() => { if (form.goalInput.trim()) setForm({ ...form, goals: [...form.goals, form.goalInput.trim()], goalInput: "" }); }} className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">+</button>
          </div>
          <ul className="space-y-1">
            {form.goals.map((g, i) => (
              <li key={i} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                <span className="text-gray-700 dark:text-gray-300">• {g}</span>
                <button type="button" onClick={() => setForm({ ...form, goals: form.goals.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600 text-xs">✕</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition text-sm font-medium">{saving ? "Guardando..." : "Crear Campaña"}</button>
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
