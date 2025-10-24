import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic"; // disable caching on Vercel

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ CREATE (POST)
export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const image = formData.get("image");

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    let bannerUrl = null;

    if (image && image.name) {
      if (process.env.NODE_ENV === "production") {
        // 🚫 Skip file writes on Vercel
        bannerUrl = "/uploads/demo-placeholder.jpg";
      } else {
        const bytes = Buffer.from(await image.arrayBuffer());
        const filename = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, filename);
        await fs.promises.writeFile(filePath, bytes);
        bannerUrl = `/uploads/${filename}`;
      }
    }

    const created = await prisma.news.create({
      data: { title, content, bannerUrl, date: new Date() },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/news error:", err);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}

// ✅ READ (GET)
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

// ✅ UPDATE (PUT)
export async function PUT(req) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");
    const title = formData.get("title");
    const content = formData.get("content");
    const image = formData.get("image");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "News item not found" }, { status: 404 });
    }

    let bannerUrl = existing.bannerUrl;

    if (image && image.name) {
      if (process.env.NODE_ENV === "production") {
        bannerUrl = "/uploads/demo-placeholder.jpg";
      } else {
        if (existing.bannerUrl) {
          const oldPath = path.join(process.cwd(), "public", existing.bannerUrl);
          if (fs.existsSync(oldPath)) await fs.promises.unlink(oldPath);
        }
        const bytes = Buffer.from(await image.arrayBuffer());
        const filename = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, filename);
        await fs.promises.writeFile(filePath, bytes);
        bannerUrl = `/uploads/${filename}`;
      }
    }

    const updated = await prisma.news.update({
      where: { id },
      data: { title, content, bannerUrl },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/news error:", err);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

// ✅ DELETE (DELETE)
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "News not found" }, { status: 404 });

    if (existing.bannerUrl && process.env.NODE_ENV !== "production") {
      const imgPath = path.join(process.cwd(), "public", existing.bannerUrl);
      if (fs.existsSync(imgPath)) await fs.promises.unlink(imgPath);
    }

    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/news error:", err);
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}
