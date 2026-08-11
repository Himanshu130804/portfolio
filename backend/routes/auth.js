import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

  const emailMatches = email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
  let passwordMatches = false;

  // Production recommendation: ADMIN_PASSWORD_HASH. For an easier first setup,
  // ADMIN_PASSWORD is also supported and can later be replaced with a bcrypt hash.
  if (process.env.ADMIN_PASSWORD_HASH) passwordMatches = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  else passwordMatches = password === process.env.ADMIN_PASSWORD;

  if (!emailMatches || !passwordMatches) return res.status(401).json({ message: "Invalid admin credentials." });
  if (!process.env.JWT_SECRET) return res.status(500).json({ message: "JWT_SECRET is missing on the server." });

  const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "12h" });
  res.json({ token });
});

export default router;
