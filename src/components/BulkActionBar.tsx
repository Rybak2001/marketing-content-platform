"use client";
import { useState } from "react";

interface BulkActionBarProps {
  selectedCount: number;
  actions: { label: string; value: string; icon: string; destructive?: boolean }[];
  onAction: (action: string) => void;
  onClear: () => void;
}

export default function BulkActionBar({ selectedCount, actions, onAction, onClear }: BulkActionBarProps) {
  const [confirming, setConfirming] = useState<string | null>(null);

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-2xl shadow-2xl border border-gray-700 animate-slideUp">
      <span className="text-sm font-medium">{selectedCount} seleccionado{selectedCount > 1 ? "s" : ""}</span>
      <div className="w-px h-5 bg-gray-600" />
      <div className="flex items-center gap-1">
        {actions.map((a) => (
          <button key={a.value}
            onClick={() => { if (a.destructive && !confirming) { setConfirming(a.value); setTimeout(() => setConfirming(null), 3000); } else { onAction(a.value); setConfirming(null); } }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${confirming === a.value ? "bg-red-600 hover:bg-red-700" : a.destructive ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-700 hover:bg-gray-600"}`}>
            <span>{a.icon}</span>
            {confirming === a.value ? "¿Confirmar?" : a.label}
          </button>
        ))}
      </div>
      <div className="w-px h-5 bg-gray-600" />
      <button onClick={onClear} className="text-sm text-gray-400 hover:text-white transition">Cancelar</button>
    </div>
  );
}
