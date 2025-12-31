import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Next.js specific cookies access
  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_WEB_TOKEN!
    ) as { user: any };

    return NextResponse.json({
      authenticated: true,
      user: payload.user,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
