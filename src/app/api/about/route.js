import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🟢 Disable caching in Vercel for dynamic fetch
export const dynamic = "force-dynamic";

// ✅ GET — fetch about content
export async function GET() {
  try {
    const about = await prisma.aboutUs.findFirst();
    return NextResponse.json(about || {});
  } catch (err) {
    console.error("GET /api/about error:", err);
    return NextResponse.json({ error: "Failed to fetch about" }, { status: 500 });
  }
}

// ✅ POST — create or update about content
export async function POST(req) {
  try {
    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const existing = await prisma.aboutUs.findFirst();

    const saved = existing
      ? await prisma.aboutUs.update({
          where: { id: existing.id },
          data: { content },
        })
      : await prisma.aboutUs.create({
          data: { content },
        });

    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error("POST /api/about error:", err);
    return NextResponse.json({ error: "Failed to save about" }, { status: 500 });
  }
}
