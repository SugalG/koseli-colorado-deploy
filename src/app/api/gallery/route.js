import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary"; // ✅ uses your configured Cloudinary client

export const dynamic = "force-dynamic"; // disable ISR caching

// ✅ GET all gallery images
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

// ✅ POST new image (upload to Cloudinary)
export async function POST(req) {
  try {
    const formData = await req.formData();
    const caption = formData.get("caption");
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary upload
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary (folder: koseli/gallery)
    const upload = await cloudinary.uploader.upload(base64Image, {
      folder: "koseli/gallery",
    });

    const created = await prisma.galleryImage.create({
      data: { caption, imageUrl: upload.secure_url },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/gallery error:", err);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

// ✅ DELETE image (Cloudinary + DB)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const image = await prisma.galleryImage.findUnique({ where: { id } });
    if (!image) return NextResponse.json({ error: "Image not found" }, { status: 404 });

    // Extract public ID from Cloudinary URL (for deletion)
    const match = image.imageUrl.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
    const publicId = match ? match[1] : null;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/gallery error:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
