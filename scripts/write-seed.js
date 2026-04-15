const fs = require("fs");
const path = require("path");

const content = `const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const S = mongoose.Schema;
const M = S.Types.Mixed;
const UserSchema = new S({ email: String, passwordHash: String, name: String, role: String, active: { type: Boolean, default: true }, avatar: String, bio: String, phone: String, timezone: String, language: String, preferences: M, apiKeys: [M], lastLogin: Date, loginCount: Number }, { timestamps: true });
const PostSchema = new S({ title: String, slug: String, content: String, excerpt: String, coverImage: String, category: String, tags: [String], status: String, publishAt: Date, author: String, authorName: String, seo: M, analytics: M, versions: [M], approval: M, priority: String, campaignId: String, templateId: String, readTime: Number, wordCount: Number, featured: Boolean, pinned: Boolean, order: Number }, { timestamps: true });
const CampaignSchema = new S({ name: String, description: String, type: String, status: String, channel: String, budget: Number, spent: Number, startDate: Date, endDate: Date, goals: [M], tags: [String], createdBy: String, assignedTo: [String], metrics: M, abTest: M }, { timestamps: true });
const TemplateSchema = new S({ name: String, description: String, category: String, type: String, content: String, thumbnail: String, variables: [String], isPublic: Boolean, usageCount: Number, createdBy: String }, { timestamps: true });
const AudienceSchema = new S({ name: String, description: String, type: String, filters: [M], contactCount: Number, tags: [String], status: String, createdBy: String }, { timestamps: true });
const ContactSchema = new S({ email: String, name: String, phone: String, company: String, source: String, tags: [String], audienceIds: [String], status: String, metadata: M, lastActivity: Date }, { timestamps: true });
const MediaSchema = new S({ filename: String, url: String, publicId: String, type: String, mimeType: String, size: Number, width: Number, height: Number, folder: String, alt: String, tags: [String], usedIn: [String], uploadedBy: String }, { timestamps: true });
const CommentSchema = new S({ content: String, postId: String, userId: String, userName: String, parentId: String, mentions: [String], resolved: Boolean, type: String }, { timestamps: true });
const ActivitySchema = new S({ action: String, entityType: String, entityId: String, entityName: String, userId: String, userName: String, details: String, metadata: M }, { timestamps: true });
const NotificationSchema = new S({ userId: String, type: String, title: String, message: String, link: String, read: Boolean }, { timestamps: true });
const SettingsSchema = new S({ key: { type: String, unique: true }, value: M, category: String, updatedBy: String }, { timestamps: true });

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  const User = mongoose.model("User", UserSchema);
  const Post = mongoose.model("Post", PostSchema);
  const Campaign = mongoose.model("Campaign", CampaignSchema);
  const Template = mongoose.model("Template", TemplateSchema);
  const Audience = mongoose.model("Audience", AudienceSchema);
  const Contact = mongoose.model("Contact", ContactSchema);
  const Media = mongoose.model("Media", MediaSchema);
  const Comment = mongoose.model("Comment", CommentSchema);
  const Activity = mongoose.model("Activity", ActivitySchema);
  const Notification = mongoose.model("Notification", NotificationSchema);
  const Settings = mongoose.model("Settings", SettingsSchema);

  await Promise.all([User.deleteMany({}), Post.deleteMany({}), Campaign.deleteMany({}), Template.deleteMany({}), Audience.deleteMany({}), Contact.deleteMany({}), Media.deleteMany({}), Comment.deleteMany({}), Activity.deleteMany({}), Notification.deleteMany({}), Settings.deleteMany({})]);

  const hash = await bcrypt.hash("admin123", 10);
  const ehash = await bcrypt.hash("editor123", 10);
  const vhash = await bcrypt.hash("viewer123", 10);

  const users = await User.insertMany([
    { email: "admin@novatech.bo", passwordHash: hash, name: "Admin NovaTech", role: "admin", active: true, bio: "Administrador de la plataforma.", phone: "+591 70000001", timezone: "America/La_Paz", language: "es", preferences: { darkMode: false, emailNotifications: true, pushNotifications: true, weeklyDigest: true, mentionAlerts: true }, loginCount: 42, lastLogin: new Date() },
    { email: "editor@novatech.bo", passwordHash: ehash, name: "Maria Garcia", role: "editor", active: true, bio: "Editora de contenido y SEO.", phone: "+591 70000002", timezone: "America/La_Paz", language: "es", preferences: { darkMode: true, emailNotifications: true, pushNotifications: false, weeklyDigest: true, mentionAlerts: true }, loginCount: 28, lastLogin: new Date(Date.now() - 86400000) },
    { email: "viewer@novatech.bo", passwordHash: vhash, name: "Carlos Lopez", role: "viewer", active: true, bio: "Analista de datos.", loginCount: 15 },
    { email: "laura@novatech.bo", passwordHash: ehash, name: "Laura Fernandez", role: "editor", active: true, bio: "Creadora multimedia.", loginCount: 20 },
    { email: "diego@novatech.bo", passwordHash: vhash, name: "Diego Morales", role: "viewer", active: false, bio: "Pasante de marketing.", loginCount: 5 }
  ]);
  const [aId, eId, vId] = [users[0]._id.toString(), users[1]._id.toString(), users[2]._id.toString()];
  console.log("Users:", users.length);

  const posts = await Post.insertMany([
    { title: "10 Estrategias de Marketing Digital para 2026", slug: "10-estrategias-marketing-2026", content: "## Introduccion\\n\\nEl marketing digital evoluciona rapido.\\n\\n### 1. IA Generativa\\nPersonaliza mensajes a escala.\\n\\n### 2. Video Corto\\nTikTok, Reels, Shorts dominan.\\n\\n### 3. Marketing Conversacional\\nChatbots avanzados.\\n\\n### 4. Social Commerce\\nCompras desde redes sociales.\\n\\n### 5. Contenido Interactivo\\nQuizzes y encuestas.", excerpt: "Las estrategias mas efectivas para 2026.", coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", category: "Marketing Digital", tags: ["estrategia", "tendencias", "2026", "IA"], status: "published", author: aId, authorName: "Admin NovaTech", seo: { metaTitle: "10 Estrategias Marketing 2026", metaDescription: "Mejores estrategias de marketing digital 2026.", keywords: ["marketing", "estrategias", "2026"] }, analytics: { views: 1842, clicks: 234, shares: 89, avgReadTime: 5.2, bounceRate: 32 }, approval: { status: "approved" }, priority: "high", readTime: 8, wordCount: 1250, featured: true, pinned: true },
    { title: "Guia Completa de SEO para Principiantes", slug: "guia-completa-seo", content: "## Que es SEO?\\n\\nOptimizar tu sitio web.\\n\\n### On-Page\\n- Keywords\\n- Meta Tags\\n- Contenido\\n\\n### Off-Page\\n- Backlinks\\n- Social Signals", excerpt: "Todo sobre SEO para principiantes.", coverImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800", category: "SEO", tags: ["seo", "guia", "google"], status: "published", author: eId, authorName: "Maria Garcia", analytics: { views: 2341, clicks: 412, shares: 156, avgReadTime: 7.8, bounceRate: 25 }, priority: "high", readTime: 12, wordCount: 2100, featured: true },
    { title: "Campana de Email Marketing Efectiva", slug: "email-marketing-efectiva", content: "## Email Marketing\\n\\nROI promedio de 42:1.\\n\\n### Elementos Clave\\n1. Linea de asunto\\n2. Personalizacion\\n3. CTA claro\\n4. Testing A/B", excerpt: "Crea campanas de email que conviertan.", coverImage: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800", category: "Email Marketing", tags: ["email", "campanas"], status: "published", author: eId, authorName: "Maria Garcia", analytics: { views: 956, clicks: 145, shares: 67, avgReadTime: 4.5, bounceRate: 38 }, priority: "medium", readTime: 6, wordCount: 980 },
    { title: "Redes Sociales: Tendencias 2026", slug: "redes-sociales-2026", content: "## TikTok & Reels\\n- Contenido autentico\\n\\n## LinkedIn\\n- Carruseles\\n\\n## Instagram\\n- Stories interactivas", excerpt: "Tendencias en redes sociales.", coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800", category: "Redes Sociales", tags: ["redes", "tiktok", "instagram"], status: "published", author: aId, authorName: "Admin NovaTech", analytics: { views: 1567, clicks: 289, shares: 123, avgReadTime: 3.8, bounceRate: 35 }, priority: "medium", readTime: 5, wordCount: 850 },
    { title: "Automatizacion de Marketing", slug: "automatizacion-marketing", content: "## Por que Automatizar?\\n\\n### Herramientas\\n- HubSpot\\n- Mailchimp\\n- Buffer\\n- Zapier", excerpt: "Automatiza tu estrategia.", coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800", category: "Automatizacion", tags: ["automatizacion", "herramientas"], status: "published", author: eId, authorName: "Maria Garcia", analytics: { views: 732, clicks: 98, shares: 45, avgReadTime: 4.1, bounceRate: 40 }, priority: "low", readTime: 5, wordCount: 780 },
    { title: "Content Marketing 2026", slug: "content-marketing-2026", content: "## Pilares\\n\\n### Investigacion\\nConoce tu audiencia.\\n\\n### Calendario\\nPlanifica 3 meses.\\n\\n### Diversificacion\\nBlog, video, podcast.", excerpt: "Estrategia de contenidos ganadora.", coverImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800", category: "Marketing de Contenidos", tags: ["contenidos", "estrategia"], status: "published", author: aId, authorName: "Admin NovaTech", analytics: { views: 1123, clicks: 178, shares: 92, avgReadTime: 6.3, bounceRate: 28 }, priority: "high", readTime: 7, wordCount: 1150, featured: true },
    { title: "Analitica Web: KPIs que Importan", slug: "analitica-web-kpis", content: "## KPIs Esenciales\\n- Tasa de Conversion\\n- CPA\\n- CLV\\n- ROAS\\n- NPS", excerpt: "KPIs que realmente importan.", coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800", category: "Analitica", tags: ["analitica", "kpis"], status: "draft", author: vId, authorName: "Carlos Lopez", approval: { status: "pending", submittedAt: new Date(), submittedBy: vId }, priority: "medium", readTime: 4, wordCount: 620 },
    { title: "Google Ads: Guia Avanzada", slug: "google-ads-avanzada", content: "## Estrategias de Puja\\n- Target CPA\\n- Target ROAS", excerpt: "Domina Google Ads.", coverImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800", category: "Publicidad", tags: ["google ads", "ppc"], status: "scheduled", publishAt: new Date(Date.now() + 604800000), author: eId, authorName: "Maria Garcia", priority: "medium", readTime: 10, wordCount: 1800 },
    { title: "Branding: Marca Fuerte", slug: "branding-marca-fuerte", content: "## 5 Pilares\\n1. Proposito\\n2. Posicionamiento\\n3. Personalidad\\n4. Promesa\\n5. Presencia", excerpt: "Construye una marca memorable.", coverImage: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800", category: "Branding", tags: ["branding", "marca"], status: "review", author: eId, authorName: "Maria Garcia", approval: { status: "pending", submittedAt: new Date(Date.now() - 86400000) }, priority: "high", readTime: 6, wordCount: 920 },
    { title: "Influencer Marketing 2026", slug: "influencer-marketing-2026", content: "## Tipos\\n- Nano (1K-10K)\\n- Micro (10K-100K)\\n- Macro (100K-1M)\\n- Mega (1M+)", excerpt: "Guia definitiva de influencer marketing.", coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800", category: "Redes Sociales", tags: ["influencers", "roi"], status: "published", author: aId, authorName: "Admin NovaTech", analytics: { views: 2156, clicks: 342, shares: 198, avgReadTime: 5.5, bounceRate: 30 }, priority: "medium", readTime: 7, wordCount: 1340, featured: true },
    { title: "Webinars como Marketing", slug: "webinars-marketing", content: "## Estructura\\n1. Intro (5 min)\\n2. Contenido (30 min)\\n3. Q&A (15 min)\\n4. CTA (5 min)", excerpt: "Webinars para generar leads.", category: "Marketing de Contenidos", tags: ["webinars", "leads"], status: "draft", author: aId, authorName: "Admin NovaTech", priority: "low", readTime: 4, wordCount: 650 },
    { title: "Marketing de Afiliados", slug: "marketing-afiliados", content: "## Como Funciona\\nGana comisiones promocionando productos.", excerpt: "Ingresos pasivos con afiliados.", category: "Marketing Digital", tags: ["afiliados", "ingresos"], status: "archived", author: eId, authorName: "Maria Garcia", priority: "low", readTime: 3, wordCount: 450 }
  ]);
  console.log("Posts:", posts.length);

  const campaigns = await Campaign.insertMany([
    { name: "Lanzamiento NovaTech 2026", description: "Campana de lanzamiento Q1 2026.", type: "social", status: "active", channel: "Instagram, TikTok", budget: 15000, spent: 8750, startDate: new Date("2026-01-15"), endDate: new Date("2026-04-30"), goals: [{ metric: "Impresiones", target: 500000, current: 312000 }, { metric: "Leads", target: 2000, current: 1340 }], tags: ["lanzamiento", "2026"], createdBy: aId, assignedTo: [aId, eId], metrics: { impressions: 312000, clicks: 18400, conversions: 287, revenue: 43050, ctr: 5.9, roi: 187 }, abTest: { enabled: true, variants: [{ name: "Video corto", weight: 50, views: 156000, conversions: 168 }, { name: "Carrusel", weight: 50, views: 156000, conversions: 119 }] } },
    { name: "Email Nurturing Q1", description: "Secuencia de nurturing.", type: "email", status: "active", channel: "Mailchimp", budget: 3000, spent: 1200, startDate: new Date("2026-01-01"), endDate: new Date("2026-03-31"), goals: [{ metric: "Open Rate", target: 35, current: 42 }], tags: ["email", "nurturing"], createdBy: eId, metrics: { impressions: 45000, clicks: 5040, conversions: 342, revenue: 12800, ctr: 11.2, roi: 327 } },
    { name: "Blog SEO Organico", description: "Estrategia SEO para 50 keywords.", type: "blog", status: "active", channel: "Blog", budget: 5000, spent: 3200, startDate: new Date("2026-01-01"), endDate: new Date("2026-12-31"), goals: [{ metric: "Trafico Organico", target: 100000, current: 45200 }], tags: ["seo", "blog"], createdBy: aId, metrics: { impressions: 890000, clicks: 45200, conversions: 1230, revenue: 28500, ctr: 5.1, roi: 470 } },
    { name: "Google Ads Q2", description: "Campanas de busqueda y display.", type: "ads", status: "paused", channel: "Google Ads", budget: 20000, spent: 12400, startDate: new Date("2026-02-01"), endDate: new Date("2026-06-30"), tags: ["google", "ppc"], createdBy: aId, metrics: { impressions: 2340000, clicks: 89700, conversions: 567, revenue: 85050, ctr: 3.8, roi: 326 } },
    { name: "Evento Tech Summit", description: "Webinar con 5 speakers.", type: "event", status: "draft", channel: "Zoom", budget: 8000, spent: 0, startDate: new Date("2026-06-15"), endDate: new Date("2026-06-15"), tags: ["evento", "webinar"], createdBy: aId },
    { name: "Campana Navidad 2026", description: "Campana navidena multicanal.", type: "social", status: "draft", channel: "Todas", budget: 25000, spent: 0, startDate: new Date("2026-11-15"), endDate: new Date("2026-12-31"), tags: ["navidad"], createdBy: aId },
    { name: "Influencer Q2", description: "Colaboracion con micro-influencers.", type: "social", status: "completed", channel: "Instagram, YouTube", budget: 10000, spent: 9800, startDate: new Date("2025-10-01"), endDate: new Date("2025-12-31"), tags: ["influencers"], createdBy: eId, metrics: { impressions: 1245000, clicks: 67800, conversions: 890, revenue: 133500, ctr: 5.4, roi: 1262 } }
  ]);
  console.log("Campaigns:", campaigns.length);

  await Template.insertMany([
    { name: "Blog Post Estandar", description: "Plantilla basica para blog.", category: "Blog", type: "post", content: "## [Titulo]\\n\\n### Introduccion\\n[Texto]\\n\\n### [Tema 1]\\n[Contenido]\\n\\n### Conclusion\\n[CTA]", variables: ["titulo", "tema1"], isPublic: true, usageCount: 34, createdBy: aId },
    { name: "Newsletter Semanal", description: "Template para newsletter.", category: "Email", type: "email", content: "# Newsletter\\n\\n## Destacado\\n[Articulo]\\n\\n## Noticias\\n- [Item 1]\\n- [Item 2]", variables: ["destacado", "noticias"], isPublic: true, usageCount: 52, createdBy: eId },
    { name: "Post Instagram Carrusel", description: "Carrusel para Instagram.", category: "Social Media", type: "social", content: "Slide 1: [Hook]\\nSlide 2-8: [Tips]\\nSlide 9: [CTA]", variables: ["hook", "tips", "cta"], isPublic: true, usageCount: 28, createdBy: eId },
    { name: "Landing Page", description: "Estructura landing page.", category: "Landing", type: "landing", content: "## Hero\\n[CTA]\\n\\n## Beneficios\\n[Items]\\n\\n## Testimonios\\n[Citas]", variables: ["hero", "beneficios"], isPublic: true, usageCount: 12, createdBy: aId },
    { name: "Caso de Estudio", description: "Caso de estudio.", category: "Blog", type: "post", content: "## [Cliente]\\n\\n### Desafio\\n[Problema]\\n\\n### Solucion\\n[Como]\\n\\n### Resultados\\n[KPIs]", variables: ["cliente", "desafio"], isPublic: true, usageCount: 8, createdBy: aId },
    { name: "Email Bienvenida", description: "Primer email.", category: "Email", type: "email", content: "# Bienvenido [nombre]!\\n\\n1. Contenido exclusivo\\n2. Ofertas\\n3. Guias", variables: ["nombre"], isPublic: true, usageCount: 156, createdBy: eId }
  ]);
  console.log("Templates: 6");

  const audiences = await Audience.insertMany([
    { name: "Suscriptores Newsletter", description: "Suscriptores activos.", type: "list", contactCount: 3450, tags: ["newsletter"], status: "active", createdBy: aId },
    { name: "Leads Calientes", description: "Interaccion 7 dias.", type: "segment", filters: [{ field: "lastActivity", operator: "within", value: "7days" }], contactCount: 234, tags: ["leads"], status: "active", createdBy: eId },
    { name: "Clientes Premium", description: "Compras > Bs 500.", type: "segment", filters: [{ field: "totalSpent", operator: "gt", value: "500" }], contactCount: 89, tags: ["premium"], status: "active", createdBy: aId },
    { name: "Segmento Tech", description: "Interesados en tech.", type: "segment", filters: [{ field: "interests", operator: "contains", value: "tech" }], contactCount: 1200, tags: ["tech"], status: "active", createdBy: eId },
    { name: "Inactivos 90d", description: "Sin actividad 90 dias.", type: "segment", filters: [{ field: "lastActivity", operator: "olderThan", value: "90days" }], contactCount: 567, tags: ["inactivos"], status: "archived", createdBy: aId }
  ]);
  console.log("Audiences:", audiences.length);

  const cN = ["Ana Martinez","Pedro Quispe","Sofia Mamani","Luis Choque","Valentina Rojas","Mateo Flores","Isabella Cruz","Santiago Vargas","Camila Mendoza","Sebastian Paz","Lucia Herrera","Nicolas Gutierrez","Mariana Torres","Andres Luna","Gabriela Reyes"];
  const cC = ["TechBolivia","Digital Andes","Innova Plus","DataCorp","CloudSur","","","","","","","","","",""];
  const cS = ["website","newsletter","referral","social","event","ads"];
  await Contact.insertMany(cN.map((n, i) => ({ email: n.toLowerCase().replace(/ /g, ".") + "@example.com", name: n, phone: "+591 7" + String(i).padStart(7, "0"), company: cC[i], source: cS[i % 6], tags: [i < 5 ? "premium" : "standard"], audienceIds: [audiences[0]._id.toString()], status: i === 14 ? "unsubscribed" : "subscribed", lastActivity: new Date(Date.now() - i * 172800000) })));
  console.log("Contacts: 15");

  await Media.insertMany([
    { filename: "hero-banner.jpg", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", type: "image", mimeType: "image/jpeg", size: 245000, width: 1200, height: 630, folder: "banners", alt: "Banner principal", tags: ["banner"], uploadedBy: aId },
    { filename: "seo-guide.jpg", url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800", type: "image", mimeType: "image/jpeg", size: 180000, width: 800, height: 450, folder: "blog", alt: "Guia SEO", tags: ["seo"], uploadedBy: eId },
    { filename: "email-mkt.jpg", url: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800", type: "image", mimeType: "image/jpeg", size: 210000, width: 800, height: 450, folder: "blog", alt: "Email marketing", tags: ["email"], uploadedBy: eId },
    { filename: "social.jpg", url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800", type: "image", mimeType: "image/jpeg", size: 195000, width: 800, height: 450, folder: "social", alt: "Redes sociales", tags: ["social"], uploadedBy: aId },
    { filename: "analytics.jpg", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800", type: "image", mimeType: "image/jpeg", size: 220000, width: 1200, height: 800, folder: "blog", alt: "Analytics", tags: ["analytics"], uploadedBy: vId },
    { filename: "logo.png", url: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400", type: "image", mimeType: "image/png", size: 45000, width: 400, height: 400, folder: "brand", alt: "Logo", tags: ["brand"], uploadedBy: aId }
  ]);
  console.log("Media: 6");

  await Comment.insertMany([
    { content: "Excelente articulo!", postId: posts[0]._id.toString(), userId: eId, userName: "Maria Garcia", type: "comment" },
    { content: "Sugiero ejemplo de SEO tecnico.", postId: posts[1]._id.toString(), userId: vId, userName: "Carlos Lopez", type: "suggestion" },
    { content: "Aprobado.", postId: posts[1]._id.toString(), userId: aId, userName: "Admin NovaTech", type: "approval" },
    { content: "@maria Revisa metricas.", postId: posts[2]._id.toString(), userId: aId, userName: "Admin NovaTech", mentions: ["maria"], type: "comment" },
    { content: "Metricas actualizadas.", postId: posts[2]._id.toString(), userId: eId, userName: "Maria Garcia", resolved: true, type: "comment" }
  ]);
  console.log("Comments: 5");

  await Activity.insertMany([
    { action: "created", entityType: "post", entityId: posts[0]._id.toString(), entityName: posts[0].title, userId: aId, userName: "Admin NovaTech", details: "Creo articulo" },
    { action: "published", entityType: "post", entityId: posts[0]._id.toString(), entityName: posts[0].title, userId: aId, userName: "Admin NovaTech", details: "Publico articulo" },
    { action: "created", entityType: "campaign", entityId: campaigns[0]._id.toString(), entityName: campaigns[0].name, userId: aId, userName: "Admin NovaTech", details: "Creo campana" },
    { action: "updated", entityType: "campaign", entityId: campaigns[0]._id.toString(), entityName: campaigns[0].name, userId: eId, userName: "Maria Garcia", details: "Actualizo metricas" },
    { action: "login", entityType: "user", entityId: aId, entityName: "Admin NovaTech", userId: aId, userName: "Admin NovaTech", details: "Inicio sesion" }
  ]);
  console.log("Activities: 5");

  await Notification.insertMany([
    { userId: aId, type: "info", title: "Nuevo comentario", message: "Maria Garcia comento en un articulo.", read: false },
    { userId: aId, type: "success", title: "Campana activa", message: "Lanzamiento alcanzo 60% de meta.", read: false },
    { userId: aId, type: "warning", title: "Post pendiente", message: "Carlos Lopez envio post para revision.", read: false },
    { userId: eId, type: "info", title: "Mencion", message: "Admin te menciono.", read: false },
    { userId: eId, type: "success", title: "Post publicado", message: "Tu articulo de SEO fue aprobado.", read: true },
    { userId: vId, type: "info", title: "Bienvenido", message: "Bienvenido a NovaTech.", read: true }
  ]);
  console.log("Notifications: 6");

  await Settings.insertMany([
    { key: "siteName", value: "NovaTech Marketing", category: "general", updatedBy: aId },
    { key: "siteDescription", value: "Plataforma de marketing digital", category: "general", updatedBy: aId },
    { key: "timezone", value: "America/La_Paz", category: "general", updatedBy: aId },
    { key: "defaultLanguage", value: "es", category: "general", updatedBy: aId },
    { key: "postsPerPage", value: 12, category: "content", updatedBy: aId },
    { key: "requireApproval", value: true, category: "workflow", updatedBy: aId },
    { key: "autoSaveInterval", value: 30, category: "editor", updatedBy: aId },
    { key: "maxUploadSize", value: 10485760, category: "media", updatedBy: aId },
    { key: "allowedFileTypes", value: ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"], category: "media", updatedBy: aId },
    { key: "socialLinks", value: { facebook: "https://facebook.com/novatech", instagram: "https://instagram.com/novatech", twitter: "https://twitter.com/novatech" }, category: "social", updatedBy: aId },
    { key: "emailProvider", value: "mailchimp", category: "integrations", updatedBy: aId },
    { key: "analyticsId", value: "GA-NOVATECH-001", category: "integrations", updatedBy: aId }
  ]);
  console.log("Settings: 12");

  console.log("\\n=== Seed complete ===");
  console.log("Admin: admin@novatech.bo / admin123");
  console.log("Editor: editor@novatech.bo / editor123");
  console.log("Viewer: viewer@novatech.bo / viewer123");
  await mongoose.disconnect();
}
seed().catch(console.error);
`;

fs.writeFileSync(path.join(__dirname, "seed.js"), content);
console.log("Seed file written successfully!");
