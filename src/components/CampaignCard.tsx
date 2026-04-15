import StatusBadge from "./StatusBadge";
import Link from "next/link";

interface CampaignData {
  _id: string;
  name: string;
  type: string;
  status: string;
  channel?: string;
  budget?: number;
  spent?: number;
  startDate?: string;
  endDate?: string;
  metrics?: { impressions?: number; clicks?: number; conversions?: number; revenue?: number; ctr?: number; roi?: number };
}

const typeIcons: Record<string, string> = { email: "📧", social: "📱", ads: "💰", blog: "✍️", seo: "🔍", event: "🎪" };

export default function CampaignCard({ campaign }: { campaign: CampaignData }) {
  const budget = campaign.budget || 0;
  const spent = campaign.spent || 0;
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

  return (
    <Link href={`/dashboard/campaigns/${campaign._id}`} className="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcons[campaign.type] || "📣"}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{campaign.name}</h3>
            <p className="text-xs text-gray-400 capitalize">{campaign.type} · {campaign.channel || "General"}</p>
          </div>
        </div>
        <StatusBadge status={campaign.status} />
      </div>
      {budget > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Presupuesto</span>
            <span>{spent.toLocaleString()} / {budget.toLocaleString()} BOB</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${pct > 90 ? "bg-red-500" : pct > 70 ? "bg-orange-500" : "bg-indigo-500"}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
      {campaign.metrics && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div><p className="text-lg font-bold text-gray-900 dark:text-white">{(campaign.metrics.impressions || 0).toLocaleString()}</p><p className="text-[10px] text-gray-400">Impresiones</p></div>
          <div><p className="text-lg font-bold text-gray-900 dark:text-white">{(campaign.metrics.clicks || 0).toLocaleString()}</p><p className="text-[10px] text-gray-400">Clicks</p></div>
          <div><p className="text-lg font-bold text-gray-900 dark:text-white">{(campaign.metrics.conversions || 0).toLocaleString()}</p><p className="text-[10px] text-gray-400">Conversiones</p></div>
        </div>
      )}
      {(campaign.startDate || campaign.endDate) && (
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {campaign.startDate && new Date(campaign.startDate).toLocaleDateString("es-BO", { day: "numeric", month: "short" })}
          {campaign.endDate && <> — {new Date(campaign.endDate).toLocaleDateString("es-BO", { day: "numeric", month: "short" })}</>}
        </div>
      )}
    </Link>
  );
}
