import express from "express";
import cors from "cors";
import path from "path";

import uploadRoutes from "./routes/upload.js";
import authRoutes from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
import messageRoutes from "./routes/messages.js";

export function createApp() {
  const app = express();

  // FRONTEND_URL can contain comma-separated URLs
  // for localhost, preview and production.
  const allowedOrigins = (
    process.env.FRONTEND_URL ||
    "http://localhost:5173"
  )
    .split(",")
    .map((item) => item.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.includes(origin)
        ) {
          return callback(null, true);
        }

        return callback(
          new Error(
            "Origin not allowed by CORS"
          )
        );
      },
    })
  );

  // Normal JSON content only.
  // Images should NOT be sent through this.
  app.use(
    express.json({
      limit: "2mb",
    })
  );

  // Allow uploaded images/files to be opened publicly.
  app.use(
    "/uploads",
    express.static(
      path.join(
        process.cwd(),
        "uploads"
      )
    )
  );

  app.get(
    "/api/health",
    (_req, res) => {
      res.json({
        ok: true,
      });
    }
  );

  app.use(
    "/api/auth",
    authRoutes
  );

  app.use(
    "/api/portfolio",
    portfolioRoutes
  );

  app.use(
    "/api/messages",
    messageRoutes
  );

  // IMPORTANT:
  // This was missing from your current file.
  app.use(
    "/api/upload",
    uploadRoutes
  );

  // Better error handling
  app.use(
    (
      error,
      _req,
      res,
      _next
    ) => {
      console.error(
        "SERVER ERROR:",
        error
      );

      // Multer file size error
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res
          .status(413)
          .json({
            message:
              "File is too large. Maximum size is 15 MB.",
          });
      }

      // Invalid file type
      if (
        error.message ===
        "Unsupported file type"
      ) {
        return res
          .status(400)
          .json({
            message:
              "Unsupported file type. Use JPG, JPEG, PNG, WEBP, PDF, DOC or DOCX.",
          });
      }

      // CORS issue
      if (
        error.message ===
        "Origin not allowed by CORS"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Frontend URL is not allowed. Check FRONTEND_URL in your backend .env file.",
          });
      }

      return res
        .status(500)
        .json({
          message:
            process.env.NODE_ENV ===
            "production"
              ? "Server error."
              : error.message,
        });
    }
  );

  return app;
}