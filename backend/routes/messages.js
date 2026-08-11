import express from "express";
import Message from "../models/Message.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (![name, email, subject, message].every((value) => typeof value === "string" && value.trim())) return res.status(400).json({ message: "Please complete every contact form field." });
    await Message.create({ name, email, subject, message });
    res.status(201).json({ message: "Thanks — your message has been received." });
  } catch (error) { next(error); }
});

router.get("/", requireAdmin, async (_req, res, next) => {
  try { res.json(await Message.find().sort({ createdAt: -1 }).lean()); }
  catch (error) { next(error); }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try { await Message.findByIdAndDelete(req.params.id); res.json({ message: "Message deleted." }); }
  catch (error) { next(error); }
});

export default router;
