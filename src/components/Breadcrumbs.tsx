import Link from "next/link";

interface Crumb { label: string; href?: string; }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
      <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>
      </Link>
      {items.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{crumb.label}</Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
