"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Breadcrumbs from "@/components/Breadcrumbs";
import TagInput from "@/components/TagInput";

export default function NewTemplatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", category: "", type: "post", content: "",
    variables: [] as string[], isPublic: false, varInput: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { varInput, ...data } = form;
      const res = await fetch("/api/templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      toast.success("Plantilla creada");
      router.push("/dashboard/templates");
    } catch { toast.error("Error al crear"); }
    finally { setSaving(false); }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Plantillas", href: "/dashboard/templates" }, { label: "Nueva" }]} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva Plantilla</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm resize-none" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm">
              <option value="post">Post</option><option value="email">Email</option><option value="social">Social</option><option value="landing">Landing</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="marketing, ventas..." className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} placeholder="Usa {{variable}} para campos dinámicos..." className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-mono" /></div>
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variables</label>
          <div className="flex gap-2 mb-2">
            <input value={form.varInput} onChange={e => setForm({ ...form, varInput: e.target.value })} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (form.varInput.trim()) setForm({ ...form, variables: [...form.variables, form.varInput.trim()], varInput: "" }); } }} placeholder="nombre_variable" className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" />
            <button type="button" onClick={() => { if (form.varInput.trim()) setForm({ ...form, variables: [...form.variables, form.varInput.trim()], varInput: "" }); }} className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">+</button>
          </div>
          <div className="flex flex-wrap gap-1">{form.variables.map((v, i) => <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded text-xs">{`{{${v}}}`}<button type="button" onClick={() => setForm({ ...form, variables: form.variables.filter((_, j) => j !== i) })} className="hover:text-red-500">×</button></span>)}</div>
        </div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isPublic} onChange={e => setForm({ ...form, isPublic: e.target.checked })} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><span className="text-sm text-gray-700 dark:text-gray-300">Plantilla pública</span></label>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition text-sm font-medium">{saving ? "Guardando..." : "Crear Plantilla"}</button>
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
