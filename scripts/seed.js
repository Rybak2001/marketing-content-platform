const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const PostSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    content: String,
    excerpt: String,
    coverImage: String,
    category: String,
    tags: [String],
    status: { type: String, enum: ["draft", "published", "scheduled"] },
    publishAt: Date,
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

const posts = [
  {
    title: "Cómo escalar tu estrategia de contenido en 2025",
    slug: "escalar-estrategia-contenido-2025",
    content: "El marketing de contenidos sigue evolucionando. En este artículo exploramos las mejores prácticas para escalar tu producción sin perder calidad. Automatización, IA generativa y workflows optimizados son clave para equipos modernos.\n\n## 1. Define tu pipeline\nEstablece etapas claras: ideación, redacción, revisión, publicación y análisis.\n\n## 2. Usa templates\nCrea plantillas para cada tipo de contenido: blog posts, emails, social media.\n\n## 3. Mide y ajusta\nKPIs claros: engagement, conversión, tiempo en página.",
    excerpt: "Aprende a escalar tu producción de contenido con automatización e IA.",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
    category: "Estrategia",
    tags: ["contenido", "estrategia", "escalamiento"],
    status: "published",
  },
  {
    title: "Guía completa de SEO para blogs corporativos",
    slug: "guia-seo-blogs-corporativos",
    content: "El SEO es fundamental para que tu contenido llegue a la audiencia correcta. Desde la investigación de keywords hasta la optimización on-page, esta guía cubre todo lo que necesitas.\n\n## Keywords Research\nUsa herramientas como Ahrefs, SEMrush o incluso Google Keyword Planner.\n\n## On-Page SEO\nOptimiza títulos, meta descriptions, headers y URLs.\n\n## Link Building\nContenido de calidad genera backlinks naturales.",
    excerpt: "Todo lo que necesitas saber sobre SEO para tu blog empresarial.",
    coverImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=400&fit=crop",
    category: "SEO",
    tags: ["seo", "blog", "google"],
    status: "published",
  },
  {
    title: "Email marketing: mejores prácticas para 2025",
    slug: "email-marketing-mejores-practicas",
    content: "El email marketing sigue siendo uno de los canales con mayor ROI. Personalización, segmentación y automatización son las claves del éxito en campañas modernas.",
    excerpt: "Maximiza tus campañas de email con estas técnicas comprobadas.",
    coverImage: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=400&fit=crop",
    category: "Email Marketing",
    tags: ["email", "automatización", "campañas"],
    status: "published",
  },
  {
    title: "Tendencias en redes sociales para marcas B2B",
    slug: "tendencias-redes-sociales-b2b",
    content: "Las redes sociales B2B van más allá de LinkedIn. Descubre cómo las marcas innovadoras usan Twitter, YouTube y hasta TikTok para generar leads.",
    excerpt: "Descubre las plataformas y formatos que funcionan para B2B.",
    coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
    category: "Redes Sociales",
    tags: ["social media", "b2b", "linkedin"],
    status: "draft",
  },
  {
    title: "Cómo medir el ROI de tu content marketing",
    slug: "medir-roi-content-marketing",
    content: "Medir el retorno de inversión en content marketing puede ser complejo. Te mostramos frameworks y métricas que realmente importan.",
    excerpt: "Frameworks y métricas para justificar tu inversión en contenido.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    category: "Analítica",
    tags: ["roi", "métricas", "analytics"],
    status: "scheduled",
    publishAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  await Post.deleteMany({});
  await Post.insertMany(posts);

  console.log(`✅ Created ${posts.length} demo posts`);
  console.log("🎉 Seed completed!");

  await mongoose.disconnect();
}

seed().catch(console.error);
