import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema({ email: { type: String, unique: true, required: true }, passwordHash: { type: String, required: true } }, { timestamps: true });
export const AdminModel = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
