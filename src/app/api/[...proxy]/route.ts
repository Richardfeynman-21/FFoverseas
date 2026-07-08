import { NextRequest, NextResponse } from "next/server";

async function proxyRequest(req: NextRequest) {
  // Prevent direct browser bar navigation (Open Relay mitigation)
  const fetchMode = req.headers.get("sec-fetch-mode");
  const fetchSite = req.headers.get("sec-fetch-site");
  
  if (fetchMode === "navigate" || fetchSite === "none") {
    return NextResponse.json({
      error: "Access Forbidden",
      message: "Direct API access is restricted. Requests must originate from the client application."
    }, { status: 403 });
  }

  const BACKEND_TARGET = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";
  const apiKey = process.env.BACKEND_API_KEY || process.env.FRONTEND_API_KEY;

  // Build target URL
  const originalUrl = req.nextUrl.pathname + req.nextUrl.search;
  const targetUrl = `${BACKEND_TARGET}${originalUrl}`;

  // Build headers
  const headers = new Headers();
  headers.set("accept", req.headers.get("accept") || "*/*");
  headers.set("accept-language", req.headers.get("accept-language") || "");
  headers.set("user-agent", req.headers.get("user-agent") || "Mozilla/5.0");
  
  const contentType = req.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (apiKey) {
    headers.set("x-orbit-api-key", apiKey);
  }

  const authorization = req.headers.get("authorization");
  if (authorization) {
    headers.set("authorization", authorization);
  }

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: headers,
    };

    // Forward the body for POST/PUT/PATCH requests
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      fetchOptions.body = await req.text();
    }

    const response = await fetch(targetUrl, fetchOptions);

    // Build Next.js Response
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (key !== "content-encoding" && key !== "transfer-encoding") {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error("Proxy fetch error:", err);
    return NextResponse.json({
      error: "Bad Gateway",
      message: "Failed to connect to the backend API service. Please try again later."
    }, { status: 502 });
  }
}

// Next.js Route handlers for standard methods
export { proxyRequest as GET, proxyRequest as POST, proxyRequest as PUT, proxyRequest as DELETE, proxyRequest as PATCH };
