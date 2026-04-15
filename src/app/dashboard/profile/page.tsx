"use client";
import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "", bio: "", phone: "", avatar: "",
    timezone: "America/La_Paz", language: "es",
    darkMode: false, emailNotifications: true, pushNotifications: false, weeklyDigest: true,
  });

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) toast.success("Perfil actualizado");
      else throw new Error();
    } catch { toast.error("Error al actualizar"); }
    finally { setSaving(false); }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Perfil" }]} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>

      {/* Avatar + Info */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm resize-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Avatar</label><input value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zona Horaria</label><input value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Idioma</label>
              <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm">
                <option value="es">Español</option><option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferencias</h2>
        <div className="space-y-3">
          {[
            { key: "darkMode", label: "Modo oscuro", desc: "Usa el tema oscuro en la plataforma" },
            { key: "emailNotifications", label: "Notif. por email", desc: "Recibe notificaciones por correo" },
            { key: "pushNotifications", label: "Notif. push", desc: "Notificaciones en el navegador" },
            { key: "weeklyDigest", label: "Resumen semanal", desc: "Recibe un resumen cada semana" },
          ].map(item => (
            <label key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <button type="button" onClick={() => setForm({ ...form, [item.key]: !(form as any)[item.key] })}
                className={`relative w-10 h-5 rounded-full transition ${(form as any)[item.key] ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${(form as any)[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition text-sm font-medium">{saving ? "Guardando..." : "Guardar Perfil"}</button>
      </div>
    </div>
  );
}
