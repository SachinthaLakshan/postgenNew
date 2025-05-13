import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("session", "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set("session_client", "", { httpOnly: false, path: "/", maxAge: 0 });
  return res;
} 