const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

for (const file of [".env.local", ".env"]) {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) continue;
  for (const line of fs.readFileSync(fullPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = String(process.env.ADMIN_EMAIL || process.env.admin_username || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || process.env.admin_password || "");
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (!email || password.length < 8) throw new Error("ADMIN_EMAIL/admin_username and an 8+ character ADMIN_PASSWORD/admin_password are required");

  await mongoose.connect(uri);
  const Admin = mongoose.models.Admin || mongoose.model("Admin", new mongoose.Schema({ email: { type: String, unique: true, required: true }, passwordHash: { type: String, required: true } }, { timestamps: true }));
  const existing = await Admin.findOne({});
  if (existing) {
    console.log(`Admin already exists (${existing.email}); no changes made.`);
  } else {
    await Admin.create({ email, passwordHash: await bcrypt.hash(password, 12) });
    console.log(`Admin seeded for ${email}.`);
  }
  await mongoose.disconnect();
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
