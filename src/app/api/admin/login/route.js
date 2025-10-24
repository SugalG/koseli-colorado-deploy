import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: "Missing credentials" },
        { status: 400 }
      );
    }

    const user = await prisma.adminUser.findUnique({ where: { username } });
    if (!user)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // ✅ Sign JWT (using your .env secret)
    const token = await new SignJWT({ sub: user.id, username: user.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    // ✅ Set secure cookie (keep maxAge synced with JWT expiration)
    const res = NextResponse.json({ ok: true, username: user.username });
    res.cookies.set("kc_admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (err) {
    console.error("POST /api/admin/login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
