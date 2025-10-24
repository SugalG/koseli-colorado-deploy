import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // ✅ Disable caching for contact info

// 🟢 GET Contact Info
export async function GET() {
  try {
    const info = await prisma.contactInfo.findFirst();
    return NextResponse.json(info || {});
  } catch (err) {
    console.error("GET /api/contact error:", err);
    return NextResponse.json({ error: "Failed to fetch contact info" }, { status: 500 });
  }
}

// 🟡 POST (Create or Update Contact Info)
export async function POST(req) {
  try {
    const { address, phone, email, facebookUrl, instagramUrl, youtubeUrl } =
      await req.json();

    const existing = await prisma.contactInfo.findFirst();
    const data = { address, phone, email, facebookUrl, instagramUrl, youtubeUrl };

    const saved = existing
      ? await prisma.contactInfo.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.contactInfo.create({ data });

    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    return NextResponse.json({ error: "Failed to update contact info" }, { status: 500 });
  }
}
