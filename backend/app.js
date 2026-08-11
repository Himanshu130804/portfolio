import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
import messageRoutes from "./routes/messages.js";

export function createApp() {
  const app = express();

  // FRONTEND_URL can contain comma-separated URLs for preview + production sites.
  const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map((item) => item.trim());
  app.use(cors({ origin: (origin, callback) => !origin || allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error("Origin not allowed by CORS")) }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRoutes);
  app.use("/api/portfolio", portfolioRoutes);
  app.use("/api/messages", messageRoutes);

  // Central error response prevents stack traces from leaking to visitors.
  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ message: "Server error. Check backend logs for details." });
  });

  return app;
}
