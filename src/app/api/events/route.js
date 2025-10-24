import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic"; // disable ISR caching

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
    if (image) {
      // ✅ Upload to Cloudinary
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

      const upload = await cloudinary.uploader.upload(base64Image, {
        folder: "koseli/events",
      });
      bannerUrl = upload.secure_url;
    }

    const created = await prisma.event.create({
      data: { title, date: new Date(date), description, location, bannerUrl },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/events error:", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
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

    // ✅ Toggle featured (JSON)
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

    // ✅ Full update (FormData)
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

    // ✅ Replace image on Cloudinary
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

      // Delete old Cloudinary image if any
      if (existing.bannerUrl) {
        const match = existing.bannerUrl.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
        const publicId = match ? match[1] : null;
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }

      const upload = await cloudinary.uploader.upload(base64Image, {
        folder: "koseli/events",
      });
      bannerUrl = upload.secure_url;
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

    if (existing.bannerUrl) {
      const match = existing.bannerUrl.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
      const publicId = match ? match[1] : null;
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/events error:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
