"use client";
import Link from "next/link";

interface TemplateData {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  type: string;
  thumbnail?: string;
  usageCount?: number;
  variables?: string[];
  isPublic?: boolean;
}

const typeIcons: Record<string, string> = { post: "📝", email: "📧", social: "📱", landing: "🌐" };
const typeColors: Record<string, string> = { post: "bg-blue-50 dark:bg-blue-900/20", email: "bg-green-50 dark:bg-green-900/20", social: "bg-purple-50 dark:bg-purple-900/20", landing: "bg-orange-50 dark:bg-orange-900/20" };

export default function TemplateCard({ template, onUse }: { template: TemplateData; onUse?: (t: TemplateData) => void }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition group">
      <div className={`h-32 flex items-center justify-center ${typeColors[template.type] || "bg-gray-50 dark:bg-gray-800"}`}>
        {template.thumbnail ? (
          <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl opacity-50">{typeIcons[template.type] || "📋"}</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">{template.name}</h3>
          {template.isPublic && <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full">Público</span>}
        </div>
        {template.description && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{template.description}</p>}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 capitalize">{template.type}</span>
            {template.usageCount !== undefined && (
              <span className="text-xs text-gray-400">· {template.usageCount} usos</span>
            )}
          </div>
          {onUse && (
            <button onClick={() => onUse(template)} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition">Usar →</button>
          )}
        </div>
        {template.variables && template.variables.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {template.variables.slice(0, 3).map((v) => (
              <span key={v} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{`{{${v}}}`}</span>
            ))}
            {template.variables.length > 3 && <span className="text-[10px] text-gray-400">+{template.variables.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
