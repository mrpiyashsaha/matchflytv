import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "development-only-secret");
export async function createAdminToken(email: string) { return new SignJWT({ email, role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret); }
export async function isAdmin() { const token = (await cookies()).get("admin_token")?.value; if (!token) return false; try { await jwtVerify(token, secret); return true; } catch { return false; } }
