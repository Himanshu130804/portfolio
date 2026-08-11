import jwt from "jsonwebtoken";

// Protects every CMS write/read route. Public portfolio visitors never need a token.
export function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Admin login required." });

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Your admin session has expired. Please log in again." });
  }
}
