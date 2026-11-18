import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CustomPageSchema = new Schema(
  {
    slug: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    content: { type: String, default: "" },
  },
  { _id: false }
);

const GalleryItemSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, unique: true, default: "main" },
    brand: String,
    tagline: String,
    accent: String,
    heroTitle: String,
    heroHighlight: String,
    heroDescription: String,
    bannerImage: String,
    apkUrl: String,
    apkUrl2: String,
    apkUrl3: String,
    app: {
      name: String,
      version: String,
      size: String,
      fileType: String,
      requirement: String,
      developer: String,
      category: String,
      price: String,
    },
    contact: { email: String, whatsapp: String },
    privacyPolicy: String,
    termsOfService: String,
    about: {
      title: String,
      subtitle: String,
      content: String,
    },
    customPages: [CustomPageSchema],
    gallery: [GalleryItemSchema],
  },
  { timestamps: true }
);

export type SiteSettings = InferSchemaType<typeof SiteSettingsSchema>;
export const SiteSettingsModel =
  mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
