import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { pgTable, timestamp } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

// Users
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Categories
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// UMKM
export const umkm = sqliteTable('umkm', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  ownerName: text('owner_name').notNull(),
  phone: text('phone').notNull(),
  district: text('district').notNull(),
  village: text('village').notNull(),
  address: text('address').notNull(),
  logoUrl: text('logo_url'),
  coverUrl: text('cover_url'),
  description: text('description'),
  status: text('status').default('Inkubator').notNull(), 
  isNaikKelas: integer('is_naik_kelas', { mode: 'boolean' }).default(false),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Products
export const products = sqliteTable('products', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  umkmId: text('umkm_id').notNull().references(() => umkm.id),
  categoryId: text('category_id').notNull().references(() => categories.id),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  price: real('price').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  isFeatured: integer('is_featured').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// News
export const news = sqliteTable("news", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  editor: text("editor"), 
  thumbnailUrl: text("thumbnail_url"),
  status: text("status").default("Draft").notNull(),
  views: integer("views").default(0).notNull(),
  likes: integer("likes").default(0).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Banners
export const banners = sqliteTable("banners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  dateText: text("date_text"),
  locationText: text("location_text"),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  linkText: text("link_text"),
  isActive: integer("is_active").default(1).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Contact Messages
export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  phone: text().notNull(),
  email: text().notNull(),
  subject: text().notNull(),
  message: text().notNull(),
  status: text().default("UNREAD").notNull(), // UNREAD, READ, REPLIED
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .$defaultFn(() => new Date()),
});

// Site Settings
export const siteSettings = sqliteTable("site_settings", {
  id: text("id").primaryKey().$defaultFn(() => "general"),
  siteName: text("site_name").default("UMKM Kabupaten Bekasi").notNull(),
  siteDescription: text("site_description").default("Direktori dan pusat informasi resmi UMKM Kabupaten Bekasi.").notNull(),
  contactPhone: text("contact_phone").default("081234567890").notNull(),
  contactEmail: text("contact_email").default("info@umkmbekasi.go.id").notNull(),
  officeAddress: text("office_address").default("Jl. A. Yani No.1, Cikarang Pusat, Bekasi").notNull(),
  instagramUrl: text("instagram_url").default("").notNull(),
  facebookUrl: text("facebook_url").default("").notNull(),
  youtubeUrl: text("youtube_url").default("").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .$defaultFn(() => new Date()),
});

// Log aktivitas
export const activityLogs = sqliteTable("activity_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userName: text("user_name").default("Admin").notNull(), 
  userEmail: text("user_email").default("-").notNull(),
  action: text("action").notNull(),
  description: text("description").notNull(), 
  ipAddress: text("ip_address").default("-").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .$defaultFn(() => new Date()),
});

// Data Mitra
export const partners = sqliteTable('partners', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  logoUrl: text('logo_url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Relasi MM mitra dan umkm
export const umkmPartners = sqliteTable('umkm_partners', {
  umkmId: text('umkm_id').notNull().references(() => umkm.id, { onDelete: 'cascade' }),
  partnerId: text('partner_id').notNull().references(() => partners.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.umkmId, table.partnerId] }),
}));

// Relasi Drizzle
export const umkmRelations = relations(umkm, ({ many }) => ({
  partners: many(umkmPartners),
}));

export const partnersRelations = relations(partners, ({ many }) => ({
  umkms: many(umkmPartners),
}));

export const umkmPartnersRelations = relations(umkmPartners, ({ one }) => ({
  umkm: one(umkm, {
    fields: [umkmPartners.umkmId],
    references: [umkm.id],
  }),
  partner: one(partners, {
    fields: [umkmPartners.partnerId],
    references: [partners.id],
  }),
}));


// Perluasan untuk media
export const media = sqliteTable('media', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  data: text('data').notNull(),        
  mimeType: text('mime_type').notNull(),  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});


