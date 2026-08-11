import express from "express";
import Portfolio from "../models/Portfolio.js";
import { requireAdmin } from "../middleware/auth.js";
import { defaultPortfolio } from "../data/defaultPortfolio.js";

const router = express.Router();

// Public route used by the React website.
router.get("/", async (_req, res, next) => {
  try {
    let portfolio = await Portfolio.findOne().lean();
    if (!portfolio) portfolio = (await Portfolio.create(defaultPortfolio)).toObject();
    res.json(portfolio);
  } catch (error) { next(error); }
});

// Protected CMS route. A single document is enough for a single-person portfolio.
router.put("/", requireAdmin, async (req, res, next) => {
  try {
    const allowed = ["hero", "about", "achievements", "experience", "education", "skills", "gallery", "contact"];
    const safeUpdate = Object.fromEntries(allowed.filter((key) => key in req.body).map((key) => [key, req.body[key]]));
    const portfolio = await Portfolio.findOneAndUpdate({}, safeUpdate, { new: true, upsert: true, runValidators: true });
    res.json(portfolio);
  } catch (error) { next(error); }
});

export default router;
