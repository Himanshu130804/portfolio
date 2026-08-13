import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Upload directory
|--------------------------------------------------------------------------
*/

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/*
|--------------------------------------------------------------------------
| Allowed file types
|--------------------------------------------------------------------------
|
| Supported:
| JPG / JPEG
| PNG
| WEBP
| PDF
| DOC
| DOCX
|
*/

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/*
|--------------------------------------------------------------------------
| Multer storage
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    const uniqueSuffix =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    cb(
      null,
      `${uniqueSuffix}-${safeName}`
    );
  },
});

/*
|--------------------------------------------------------------------------
| Multer configuration
|--------------------------------------------------------------------------
|
| Maximum file size: 15 MB
|
*/

const upload = multer({
  storage,

  limits: {
    fileSize:
      15 * 1024 * 1024,
  },

  fileFilter: (
    _req,
    file,
    cb
  ) => {
    if (
      !allowedTypes.includes(
        file.mimetype
      )
    ) {
      return cb(
        new Error(
          "Unsupported file type"
        )
      );
    }

    cb(null, true);
  },
});

/*
|--------------------------------------------------------------------------
| POST /api/upload
|--------------------------------------------------------------------------
|
| Requires admin authentication.
|
| Frontend must send:
|
| FormData:
| file -> actual file
|
*/

router.post(
  "/",
  requireAdmin,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({
          message:
            "No file uploaded.",
        });
    }

    return res
      .status(201)
      .json({
        success: true,

        file: {
          name:
            req.file.originalname,

          filename:
            req.file.filename,

          type:
            req.file.mimetype,

          size:
            req.file.size,

          url:
            `/uploads/${req.file.filename}`,
        },

        // These fields are also
        // returned at the top level
        // for easier frontend use.
        name:
          req.file.originalname,

        type:
          req.file.mimetype,

        size:
          req.file.size,

        url:
          `/uploads/${req.file.filename}`,
      });
  }
);

export default router;