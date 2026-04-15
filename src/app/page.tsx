import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  status: string;
  featured?: boolean;
  analytics?: { views?: number };
  readTime?: number;
  createdAt: string;
}

async function getPublishedPosts(): Promise<Post[]> {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  const res = await fetch(`${base}/api/posts?status=published&sort=createdAt&order=desc`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const posts = await getPublishedPosts();
  const featured = posts.filter(p => p.featured);
  const regular = posts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            NovaTech
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Inicio</Link>
            <Link href="/dashboard" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium">Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center relative">
          <span className="inline-block text-indigo-200 text-sm font-medium mb-4 tracking-wide uppercase">Plataforma de Marketing Digital</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Contenido que <span className="text-yellow-300">impulsa</span> resultados
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
            Crea, publica y analiza contenido digital desde un solo lugar. Campañas, plantillas, audiencias y analíticas integradas.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/dashboard" className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg">Comenzar →</Link>
            <Link href="/login" className="bg-white/10 backdrop-blur text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition border border-white/20">Iniciar Sesión</Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Featured */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">⭐ Destacados</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.slice(0, 2).map(post => (
                <article key={post._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition group">
                  {post.coverImage && (
                    <div className="h-56 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{post.category}</span>
                      {post.readTime && <span className="text-xs text-gray-400">· {post.readTime} min lectura</span>}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{post.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map(tag => <span key={tag} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full">#{tag}</span>)}
                      </div>
                      <span className="text-xs text-gray-400">{post.analytics?.views || 0} vistas</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-400 dark:text-gray-500 text-lg mb-4">No hay publicaciones aún</p>
            <Link href="/dashboard/new" className="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium">Crear primera publicación</Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Últimas Publicaciones</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(regular.length > 0 ? regular : posts).map((post) => (
                <article key={post._id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition group">
                  {post.coverImage && (
                    <div className="h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{post.category}</span>
                      {post.readTime && <span className="text-xs text-gray-400">· {post.readTime} min</span>}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{post.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => <span key={tag} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full">#{tag}</span>)}
                      </div>
                      <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString("es-BO", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} NovaTech · Plataforma de Marketing Digital · Bolivia</p>
        </div>
      </footer>
    </div>
  );
}
