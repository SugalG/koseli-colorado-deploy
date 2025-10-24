import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

// 🟢 CREATE (POST)
export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const image = formData.get("image");

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content required" },
        { status: 400 }
      );
    }

    let bannerUrl = null;

    // ✅ Upload to Cloudinary if image is provided
    if (image && image.name) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      bannerUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "koseli/news" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    }

    // ✅ Save to DB
    const created = await prisma.news.create({
      data: {
        title,
        content,
        bannerUrl,
        date: new Date(),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/news error:", err);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}

// 🟡 READ (GET)
export async function GET() {
  try {
    const items = await prisma.news.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(items);
  } catch (err) {
    console.error("GET /api/news error:", err);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

// 🟠 UPDATE (PUT)
export async function PUT(req) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");
    const title = formData.get("title");
    const content = formData.get("content");
    const image = formData.get("image");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let bannerUrl = existing.bannerUrl;

    // ✅ Re-upload if new image is provided
    if (image && image.name) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      bannerUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "koseli/news" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    }

    const updated = await prisma.news.update({
      where: { id },
      data: { title, content, bannerUrl },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/news error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// 🔴 DELETE
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/news error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
