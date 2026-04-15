"use client";
import toast from "react-hot-toast";

interface ExportButtonProps {
  type: "posts" | "contacts";
  label?: string;
}

export default function ExportButton({ type, label }: ExportButtonProps) {
  async function handleExport() {
    try {
      const res = await fetch(`/api/export?type=${type}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-export-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${type === "posts" ? "Posts" : "Contactos"} exportados`);
    } catch {
      toast.error("Error al exportar");
    }
  }

  return (
    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      {label || "Exportar CSV"}
    </button>
  );
}
