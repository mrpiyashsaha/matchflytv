import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { AdminModel } from "@/lib/models/admin";

export async function POST(request: Request) {
  try {
    await connectDb();
    if (await AdminModel.exists({})) return NextResponse.json({ error: "Admin is already initialized" }, { status: 409 });
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || process.env.ADMIN_EMAIL || process.env.admin_username || "").trim().toLowerCase();
    const password = String(body.password || process.env.ADMIN_PASSWORD || process.env.admin_password || "");
    if (!email || password.length < 8) return NextResponse.json({ error: "Provide an email and a password of at least 8 characters" }, { status: 400 });
    await AdminModel.create({ email, passwordHash: await bcrypt.hash(password, 12) });
    return NextResponse.json({ ok: true, message: "Admin initialized. You can now sign in." }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 }); }
}
