import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));


// Routes
app.use("/api/contact", contactRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Backend is Running...");
});

// Server Listen
const PORT = process.env.PORT || 5260;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
