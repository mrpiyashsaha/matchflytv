import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { AdminModel } from "@/lib/models/admin";
import { createAdminToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  try {
    await connectDb();
    const admin = await AdminModel.findOne({ email: email.toLowerCase() });
    const valid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_token", await createAdminToken(admin.email), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
    return response;
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 }); }
}
