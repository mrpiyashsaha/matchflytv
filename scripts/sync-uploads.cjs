const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://matchflytv:31HzfghHuTiYGE0e@cluster0.lgpaf7i.mongodb.net/matchflytv?compressors=zlib";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB Atlas");

  const ImageSchema = new mongoose.Schema(
    {
      filename: { type: String, required: true, unique: true },
      contentType: String,
      data: Buffer,
      size: Number,
    },
    { timestamps: true }
  );

  const ImageModel =
    mongoose.models.UploadedImage || mongoose.model("UploadedImage", ImageSchema);

  const dir = path.join(process.cwd(), "public", "uploads");
  const files = fs
    .readdirSync(dir)
    .filter((f) => !fs.statSync(path.join(dir, f)).isDirectory());

  console.log(`Found ${files.length} files in public/uploads`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase().replace(".", "");
    const mime =
      ext === "png"
        ? "image/png"
        : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "webp"
        ? "image/webp"
        : "application/octet-stream";

    const buf = fs.readFileSync(path.join(dir, file));
    await ImageModel.updateOne(
      { filename: file },
      { $set: { filename: file, contentType: mime, data: buf, size: buf.length } },
      { upsert: true }
    );
  }

  console.log(`Successfully synced ${files.length} images to MongoDB Atlas!`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

