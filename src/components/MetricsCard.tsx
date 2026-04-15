interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: number;
  subtitle?: string;
  color?: "indigo" | "green" | "blue" | "orange" | "red" | "violet";
}

const colorMap = {
  indigo: "from-indigo-500 to-indigo-600",
  green: "from-green-500 to-green-600",
  blue: "from-blue-500 to-blue-600",
  orange: "from-orange-500 to-orange-600",
  red: "from-red-500 to-red-600",
  violet: "from-violet-500 to-violet-600",
};

export default function MetricsCard({ title, value, icon, change, subtitle, color = "indigo" }: MetricsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{typeof value === "number" ? value.toLocaleString() : value}</p>
          {change !== undefined && (
            <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={change >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} /></svg>
              {Math.abs(change)}%
            </p>
          )}
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white text-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
