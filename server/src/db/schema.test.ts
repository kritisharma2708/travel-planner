import { describe, it, expect } from "vitest";
import { trips, messages, users } from "./schema";
import { getTableColumns } from "drizzle-orm";

describe("schema: trips table", () => {
  it("has the expected columns", () => {
    const columns = getTableColumns(trips);
    const columnNames = Object.keys(columns);
    expect(columnNames).toContain("id");
    expect(columnNames).toContain("shareSlug");
    expect(columnNames).toContain("title");
    expect(columnNames).toContain("destination");
    expect(columnNames).toContain("itinerary");
    expect(columnNames).toContain("userInput");
    expect(columnNames).toContain("userId");
    expect(columnNames).toContain("createdAt");
    expect(columnNames).toContain("updatedAt");
  });
});

describe("schema: messages table", () => {
  it("has the expected columns", () => {
    const columns = getTableColumns(messages);
    const columnNames = Object.keys(columns);
    expect(columnNames).toContain("id");
    expect(columnNames).toContain("tripId");
    expect(columnNames).toContain("role");
    expect(columnNames).toContain("content");
    expect(columnNames).toContain("createdAt");
  });
});

describe("schema: users table", () => {
  it("has the expected columns", () => {
    const columns = getTableColumns(users);
    const columnNames = Object.keys(columns);
    expect(columnNames).toContain("id");
    expect(columnNames).toContain("email");
    expect(columnNames).toContain("name");
    expect(columnNames).toContain("createdAt");
  });
});
