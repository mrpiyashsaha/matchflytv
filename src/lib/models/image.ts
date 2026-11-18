import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ImageSchema = new Schema(
  {
    filename: { type: String, required: true, unique: true, index: true },
    contentType: { type: String, required: true, default: "image/png" },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

export type ImageDoc = InferSchemaType<typeof ImageSchema>;
export const ImageModel =
  mongoose.models.UploadedImage || mongoose.model("UploadedImage", ImageSchema);

