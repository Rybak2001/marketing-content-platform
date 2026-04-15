const actionLabels: Record<string, string> = {
  create: "creó", update: "actualizó", delete: "eliminó", publish: "publicó",
  archive: "archivó", login: "inició sesión", upload: "subió", comment: "comentó",
  approve: "aprobó", reject: "rechazó", schedule: "programó", send: "envió"
};

interface ActivityItem {
  _id: string;
  action: string;
  entityType: string;
  entityName: string;
  userName: string;
  createdAt: string;
  details?: string;
}

export default function ActivityTimeline({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="space-y-0">
      {activities.map((a, i) => (
        <div key={a._id} className="flex gap-3 relative">
          {i < activities.length - 1 && <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />}
          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-0.5 z-10">
            <span className="text-xs">{a.entityType === "post" ? "📝" : a.entityType === "campaign" ? "📣" : a.entityType === "user" ? "👤" : "📎"}</span>
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm text-gray-900 dark:text-white">
              <span className="font-medium">{a.userName}</span>{" "}
              <span className="text-gray-500 dark:text-gray-400">{actionLabels[a.action] || a.action}</span>{" "}
              <span className="font-medium">{a.entityName}</span>
            </p>
            {a.details && <p className="text-xs text-gray-400 mt-0.5">{a.details}</p>}
            <p className="text-xs text-gray-400 mt-0.5">{new Date(a.createdAt).toLocaleString("es-BO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
