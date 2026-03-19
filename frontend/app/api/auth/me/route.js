import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) return NextResponse.json({ authenticated: false });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ authenticated: true, user });
  } catch (err) {
    return NextResponse.json({ authenticated: false });
  }
}