import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import chatRouter from "./routes/chat";
import tripsRouter from "./routes/trips";
import { errorHandler } from "./middleware/errorHandler";

// Load .env from project root (works for both dev via tsx and production via compiled dist/)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
if (!process.env.OPENAI_API_KEY) {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/chat", chatRouter);
app.use("/api/trips", tripsRouter);

// Serve static frontend in production
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Wanderly server running at http://localhost:${PORT}`);
});
