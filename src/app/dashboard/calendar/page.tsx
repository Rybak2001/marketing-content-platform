"use client";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import StatusBadge from "@/components/StatusBadge";

const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

interface CalendarPost { _id: string; title: string; status: string; publishAt?: string; createdAt: string }

export default function CalendarPage() {
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts?limit=100").then(r => r.ok ? r.json() : []).then(d => { setPosts(d); setLoading(false); });
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function getPostsForDay(day: number) {
    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return posts.filter(p => {
      const d = p.publishAt || p.createdAt;
      return d?.startsWith(dayStr);
    });
  }

  function prev() { setCurrentDate(new Date(year, month - 1, 1)); }
  function next() { setCurrentDate(new Date(year, month + 1, 1)); }
  function today() { setCurrentDate(new Date()); }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: "Calendario" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendario de Contenido</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Visualiza tu programación de publicaciones</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={today} className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition">Hoy</button>
          <button onClick={prev} className="p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[160px] text-center">{months[month]} {year}</span>
          <button onClick={next} className="p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-[600px] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            {days.map(d => (
              <div key={d} className="px-2 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{d}</div>
            ))}
          </div>
          {/* Days */}
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayPosts = getPostsForDay(day);
              const isToday = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` === todayStr;
              return (
                <div key={day} className={`min-h-[100px] border-b border-r border-gray-100 dark:border-gray-800 p-1.5 ${isToday ? "bg-indigo-50 dark:bg-indigo-900/10" : "hover:bg-gray-50 dark:hover:bg-gray-800/30"} transition`}>
                  <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full ${isToday ? "bg-indigo-600 text-white" : "text-gray-700 dark:text-gray-300"}`}>{day}</span>
                  <div className="mt-1 space-y-0.5">
                    {dayPosts.slice(0, 3).map(p => (
                      <div key={p._id} className={`text-[10px] px-1 py-0.5 rounded truncate ${p.status === "published" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : p.status === "scheduled" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
                        {p.title}
                      </div>
                    ))}
                    {dayPosts.length > 3 && <p className="text-[10px] text-gray-400 px-1">+{dayPosts.length - 3} más</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Publicado</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Programado</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400" /> Borrador</span>
      </div>
    </div>
  );
}
