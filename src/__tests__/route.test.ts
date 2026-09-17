import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/generate-brief/route";
import { NextRequest } from "next/server";

describe("API Route: /api/generate-brief", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.GEMINI_API_KEY = "test-mock-key";
  });

  it("returns 400 Bad Request when narrative is less than 5 characters", async () => {
    const req = new NextRequest("http://localhost:3000/api/generate-brief", {
      method: "POST",
      body: JSON.stringify({ narrative: "hi" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("at least 5 characters long");
  });

  it("returns 400 Bad Request when narrative exceeds 10000 characters", async () => {
    const longNarrative = "a".repeat(10005);
    const req = new NextRequest("http://localhost:3000/api/generate-brief", {
      method: "POST",
      body: JSON.stringify({ narrative: longNarrative }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("maximum safety limit");
  });

  it("returns 500 when GEMINI_API_KEY is missing", async () => {
    delete process.env.GEMINI_API_KEY;

    const req = new NextRequest("http://localhost:3000/api/generate-brief", {
      method: "POST",
      body: JSON.stringify({ narrative: "Valid narrative text for testing dispute" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toContain("GEMINI_API_KEY");
  });

  it("includes security headers in API responses", async () => {
    const req = new NextRequest("http://localhost:3000/api/generate-brief", {
      method: "POST",
      body: JSON.stringify({ narrative: "abc" }),
    });

    const res = await POST(req);
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });
});
