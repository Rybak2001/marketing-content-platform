"use client";
import { useState } from "react";

interface DateRange { from: string; to: string }

export default function DateRangePicker({ value, onChange }: { value: DateRange; onChange: (range: DateRange) => void }) {
  const [open, setOpen] = useState(false);
  const presets = [
    { label: "Hoy", days: 0 },
    { label: "7 días", days: 7 },
    { label: "30 días", days: 30 },
    { label: "90 días", days: 90 },
    { label: "Este año", days: -1 },
  ];

  function applyPreset(days: number) {
    const to = new Date().toISOString().split("T")[0];
    let from: string;
    if (days === -1) {
      from = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
    } else if (days === 0) {
      from = to;
    } else {
      from = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
    }
    onChange({ from, to });
    setOpen(false);
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        {value.from && value.to ? `${value.from} — ${value.to}` : "Seleccionar período"}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 w-72">
            <div className="flex flex-wrap gap-2 mb-4">
              {presets.map((p) => (
                <button key={p.label} onClick={() => applyPreset(p.days)} className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition">
                  {p.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 font-medium uppercase">Desde</label>
                <input type="date" value={value.from} onChange={(e) => onChange({ ...value, from: e.target.value })} className="w-full mt-1 px-2 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-medium uppercase">Hasta</label>
                <input type="date" value={value.to} onChange={(e) => onChange({ ...value, to: e.target.value })} className="w-full mt-1 px-2 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
