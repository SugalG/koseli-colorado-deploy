import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // disables caching on Vercel

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 🟢 CREATE (POST)
export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const date = formData.get("date");
    const description = formData.get("description");
    const location = formData.get("location");
    const image = formData.get("image");

    if (!title || !date || !description || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let bannerUrl = null;
    if (image && image.name) {
      if (process.env.NODE_ENV === "production") {
        // 🚫 no file writes on Vercel
        bannerUrl = "/uploads/demo-placeholder.jpg";
      } else {
        const bytes = Buffer.from(await image.arrayBuffer());
        const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.promises.writeFile(filePath, bytes);
        bannerUrl = `/uploads/${fileName}`;
      }
    }

    const created = await prisma.event.create({
      data: { title, date: new Date(date), description, location, bannerUrl },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/events error:", err);
    return NextResponse.json({ events: [], error: "Failed to create event" }, { status: 500 });
  }
}

// 🟡 READ (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured") === "true";
    const upcoming = searchParams.get("upcoming") === "true";
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    const where = {};
    if (featured) where.isFeatured = true;
    if (upcoming) where.date = { gte: new Date() };

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: upcoming ? "asc" : "desc" },
      take: limit > 0 ? limit : undefined,
    });

    return NextResponse.json(events);
  } catch (err) {
    console.error("GET /api/events error:", err);
    return NextResponse.json({ events: [], error: "Failed to fetch events" }, { status: 500 });
  }
}

// 🟠 UPDATE (PUT)
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing event ID" }, { status: 400 });

    const contentType = req.headers.get("content-type") || "";

    // JSON updates (feature toggle)
    if (contentType.includes("application/json")) {
      const { isFeatured } = await req.json();

      if (isFeatured) {
        await prisma.event.updateMany({
          where: { isFeatured: true, NOT: { id } },
          data: { isFeatured: false },
        });
      }

      const updated = await prisma.event.update({
        where: { id },
        data: { isFeatured },
      });

      return NextResponse.json(updated);
    }

    // Form updates (full edit)
    const formData = await req.formData();
    const title = formData.get("title");
    const date = formData.get("date");
    const description = formData.get("description");
    const location = formData.get("location");
    const image = formData.get("image");

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

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
        const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.promises.writeFile(filePath, bytes);
        bannerUrl = `/uploads/${fileName}`;
      }
    }

    const updated = await prisma.event.update({
      where: { id },
      data: { title, description, location, bannerUrl, date: new Date(date) },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/events error:", err);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// 🔴 DELETE
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing event ID" }, { status: 400 });

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    if (existing.bannerUrl && process.env.NODE_ENV !== "production") {
      const oldPath = path.join(process.cwd(), "public", existing.bannerUrl);
      if (fs.existsSync(oldPath)) await fs.promises.unlink(oldPath);
    }

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/events error:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
