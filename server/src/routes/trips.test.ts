import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

// Mock the db module before importing the router
vi.mock("../db", () => {
  return {
    db: undefined as unknown,
  };
});

import { db } from "../db";
import tripsRouter from "./trips";

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/trips", tripsRouter);
  return app;
}

describe("GET /api/trips", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty array when db is not available", async () => {
    // db is undefined by default from our mock
    const app = createApp();
    const res = await request(app).get("/api/trips");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ trips: [] });
  });

  it("returns trips from the database", async () => {
    const mockTrips = [
      {
        id: "abc-123",
        shareSlug: "slug1",
        title: "Trip to Paris",
        destination: "Paris",
        createdAt: new Date().toISOString(),
      },
    ];

    // Temporarily set db to a mock object
    const dbModule = await import("../db");
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue(mockTrips),
    };
    (dbModule as { db: unknown }).db = mockDb;

    const app = createApp();
    const res = await request(app).get("/api/trips");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ trips: mockTrips });

    // Restore db to undefined
    (dbModule as { db: unknown }).db = undefined;
  });
});

describe("GET /api/trips/:idOrSlug", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 503 when db is not available", async () => {
    const dbModule = await import("../db");
    (dbModule as { db: unknown }).db = undefined;

    const app = createApp();
    const res = await request(app).get("/api/trips/nonexistent-id");
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ error: "Database not available" });
  });

  it("returns 404 for nonexistent trip", async () => {
    const dbModule = await import("../db");
    const mockDb = {
      query: {
        trips: {
          findFirst: vi.fn().mockResolvedValue(undefined),
        },
      },
    };
    (dbModule as { db: unknown }).db = mockDb;

    const app = createApp();
    const res = await request(app).get("/api/trips/nonexistent-id");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Trip not found" });

    (dbModule as { db: unknown }).db = undefined;
  });
});

describe("DELETE /api/trips/:id", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 503 when db is not available", async () => {
    const dbModule = await import("../db");
    (dbModule as { db: unknown }).db = undefined;

    const app = createApp();
    const res = await request(app).delete("/api/trips/some-id");
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ error: "Database not available" });
  });

  it("returns success when deleting a trip", async () => {
    const dbModule = await import("../db");
    const mockDb = {
      delete: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    };
    (dbModule as { db: unknown }).db = mockDb;

    const app = createApp();
    const res = await request(app).delete("/api/trips/some-id");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });

    (dbModule as { db: unknown }).db = undefined;
  });
});
