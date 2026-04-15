"use client";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import toast from "react-hot-toast";
import { useAuth } from "@/components/AuthProvider";

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    siteName: "", siteDescription: "", siteUrl: "", contactEmail: "",
    postsPerPage: 10, allowComments: true, moderateComments: false,
    defaultPostStatus: "draft", timezone: "America/La_Paz", language: "es",
    emailFrom: "", smtpHost: "", socialTwitter: "", socialFacebook: "", socialInstagram: "",
  });

  useEffect(() => {
    fetch("/api/settings").then(r => r.ok ? r.json() : {}).then((d: Record<string, any>) => {
      setSettings(d);
      setForm(prev => ({
        ...prev,
        siteName: d.siteName || "NovaTech Marketing",
        siteDescription: d.siteDescription || "",
        siteUrl: d.siteUrl || "",
        contactEmail: d.contactEmail || "",
        postsPerPage: d.postsPerPage || 10,
        allowComments: d.allowComments !== false,
        moderateComments: d.moderateComments === true,
        defaultPostStatus: d.defaultPostStatus || "draft",
        timezone: d.timezone || "America/La_Paz",
        language: d.language || "es",
        emailFrom: d.emailFrom || "",
        smtpHost: d.smtpHost || "",
        socialTwitter: d.socialTwitter || "",
        socialFacebook: d.socialFacebook || "",
        socialInstagram: d.socialInstagram || "",
      }));
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(form)) {
        await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value, category: key.startsWith("social") ? "social" : key.startsWith("smtp") || key.startsWith("email") ? "email" : "general" }),
        });
      }
      toast.success("Configuración guardada");
    } catch { toast.error("Error al guardar"); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Ajustes" }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ajustes</h1>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition text-sm font-medium">{saving ? "Guardando..." : "Guardar Cambios"}</button>
      </div>

      {/* General */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Sitio</label><input value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label><textarea value={form.siteDescription} onChange={e => setForm({ ...form, siteDescription: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL del Sitio</label><input value={form.siteUrl} onChange={e => setForm({ ...form, siteUrl: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email de Contacto</label><input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Posts por Página</label><input type="number" value={form.postsPerPage} onChange={e => setForm({ ...form, postsPerPage: Number(e.target.value) })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zona Horaria</label><input value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado por Defecto</label>
              <select value={form.defaultPostStatus} onChange={e => setForm({ ...form, defaultPostStatus: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm">
                <option value="draft">Borrador</option><option value="review">Revisión</option><option value="published">Publicado</option>
              </select>
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.allowComments} onChange={e => setForm({ ...form, allowComments: e.target.checked })} className="rounded border-gray-300 text-indigo-600" /><span className="text-sm text-gray-700 dark:text-gray-300">Permitir comentarios</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.moderateComments} onChange={e => setForm({ ...form, moderateComments: e.target.checked })} className="rounded border-gray-300 text-indigo-600" /><span className="text-sm text-gray-700 dark:text-gray-300">Moderar comentarios</span></label>
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Redes Sociales</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter / X</label><input value={form.socialTwitter} onChange={e => setForm({ ...form, socialTwitter: e.target.value })} placeholder="@usuario" className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facebook</label><input value={form.socialFacebook} onChange={e => setForm({ ...form, socialFacebook: e.target.value })} placeholder="https://facebook.com/..." className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram</label><input value={form.socialInstagram} onChange={e => setForm({ ...form, socialInstagram: e.target.value })} placeholder="@usuario" className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
        </div>
      </section>

      {/* Email */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email (SMTP)</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Remitente</label><input value={form.emailFrom} onChange={e => setForm({ ...form, emailFrom: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Host SMTP</label><input value={form.smtpHost} onChange={e => setForm({ ...form, smtpHost: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
          </div>
        </div>
      </section>
    </div>
  );
}
