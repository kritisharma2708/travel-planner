import { Router, Request, Response } from "express";
import { eq, or, desc } from "drizzle-orm";
import { db } from "../db";
import { trips, messages } from "../db/schema";

const router = Router();

// GET /api/trips — List all trips
router.get("/", async (_req: Request, res: Response) => {
  if (!db) {
    res.json({ trips: [] });
    return;
  }

  const allTrips = await db
    .select({
      id: trips.id,
      shareSlug: trips.shareSlug,
      title: trips.title,
      destination: trips.destination,
      createdAt: trips.createdAt,
    })
    .from(trips)
    .orderBy(desc(trips.createdAt));

  res.json({ trips: allTrips });
});

// GET /api/trips/:idOrSlug — Get a single trip
router.get("/:idOrSlug", async (req: Request, res: Response) => {
  if (!db) {
    res.status(503).json({ error: "Database not available" });
    return;
  }

  const idOrSlug = req.params.idOrSlug as string;

  const trip = await db.query.trips.findFirst({
    where: or(eq(trips.id, idOrSlug), eq(trips.shareSlug, idOrSlug)),
  });

  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }

  const tripMessages = await db.query.messages.findMany({
    where: eq(messages.tripId, trip.id),
    orderBy: (m, { asc }) => [asc(m.createdAt)],
  });

  res.json({ trip, messages: tripMessages });
});

// DELETE /api/trips/:id — Delete a trip
router.delete("/:id", async (req: Request, res: Response) => {
  if (!db) {
    res.status(503).json({ error: "Database not available" });
    return;
  }

  await db.delete(trips).where(eq(trips.id, req.params.id as string));
  res.json({ success: true });
});

export default router;
