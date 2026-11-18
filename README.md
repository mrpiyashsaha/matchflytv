# Matchfly TV

Next.js + MongoDB + JWT foundation for the Matchfly TV APK download website.

## Run locally

1. Copy `.env.example` to `.env.local` and set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` (or the existing `admin_username` and `admin_password` names).
2. Run `npm.cmd run dev`.
3. Seed the first admin with `npm.cmd run seed:admin`, or call `POST /api/admin/setup` with `{ "email": "...", "password": "..." }`, then open `/admin/login`.

The public site has a safe fallback dataset when MongoDB is unavailable. The admin settings page stores the APK download URL, app metadata, contact details, and privacy policy in MongoDB. Every public download button reads the saved APK URL. Never expose or reuse the setup endpoint after the first admin has been created.
