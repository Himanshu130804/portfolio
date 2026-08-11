import mongoose from "mongoose";

// Opens the MongoDB connection once when the backend starts.
// MONGO_URI should point to MongoDB Atlas in production.
export async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in backend environment variables.");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
}
