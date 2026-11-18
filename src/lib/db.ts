import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
let cached = (globalThis as typeof globalThis & { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }).mongoose;

if (!cached) cached = (globalThis as typeof globalThis & { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }).mongoose = { conn: null, promise: null };

export async function connectDb() {
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (cached?.conn) return cached.conn;
  if (!cached?.promise) cached!.promise = mongoose.connect(uri, { serverSelectionTimeoutMS: 2000, connectTimeoutMS: 2000 });
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
