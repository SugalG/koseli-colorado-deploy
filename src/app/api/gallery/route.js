import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic"; // disable ISR caching

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ GET all images
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(images);
  } catch (err) {
    console.error("GET /api/gallery error:", err);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// ✅ POST new image
export async function POST(req) {
  try {
    const formData = await req.formData();
    const caption = formData.get("caption");
    const image = formData.get("image");

    if (!image || !image.name) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    let imageUrl;

    if (process.env.NODE_ENV === "production") {
      // 🚫 skip file writes on Vercel
      imageUrl = "/uploads/demo-placeholder.jpg";
    } else {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`;
      const filepath = path.join(uploadDir, filename);
      await fs.promises.writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const created = await prisma.galleryImage.create({
      data: { caption, imageUrl },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/gallery error:", err);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

// ✅ DELETE image
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const image = await prisma.galleryImage.findUnique({ where: { id } });
    if (!image) return NextResponse.json({ error: "Image not found" }, { status: 404 });

    if (process.env.NODE_ENV !== "production" && image.imageUrl) {
      const filePath = path.join(process.cwd(), "public", image.imageUrl);
      if (fs.existsSync(filePath)) await fs.promises.unlink(filePath);
    }

    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/gallery error:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
