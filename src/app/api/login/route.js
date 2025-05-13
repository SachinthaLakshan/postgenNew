import { NextResponse } from "next/server";
import { connectToDB } from "../../../utils/mongo";

export async function POST(req) {
  const { email, password } = await req.json();
  const client = await connectToDB();
  const db = client.db();
  const user = await db.collection("users").findOne({ email });
  console.log("User found:", user);
  
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  // Set a session cookie
  const res = NextResponse.json({ success: true });
  res.cookies.set("session", email, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
} 