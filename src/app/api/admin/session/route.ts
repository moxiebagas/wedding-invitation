import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/adminSession";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, username: session.username });
}
