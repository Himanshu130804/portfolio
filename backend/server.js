import dns from "node:dns";
import "dotenv/config";

import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";

// Your Node.js DNS resolver is currently using 127.0.0.1,
// which is causing MongoDB Atlas SRV lookup to fail.
// These public DNS servers allow Node to resolve mongodb+srv records correctly.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const port = process.env.PORT || 5000;

try {
  await connectDB();

  createApp().listen(port, () => {
    console.log(`Portfolio API running on port ${port}`);
  });
} catch (error) {
  console.error("Backend could not start:", error.message);
  process.exit(1);
}