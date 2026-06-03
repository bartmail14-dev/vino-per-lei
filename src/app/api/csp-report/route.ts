import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 16_384) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  try {
    const report = await request.json();
    console.warn("[csp-report]", JSON.stringify(report).slice(0, 4000));
  } catch {
    return NextResponse.json({ error: "Invalid report" }, { status: 400 });
  }

  return new NextResponse(null, { status: 204 });
}
