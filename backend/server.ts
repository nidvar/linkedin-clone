// --------------------
// Environment variables
// --------------------
import dotenv from "dotenv";
dotenv.config();

// --------------------
// Third-party imports
// --------------------
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// --------------------
// Local imports
// --------------------
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";

// --------------------
// App setup
// --------------------
const app = express();
const PORT = process.env.PORT || 5000;
const __dirnameResolved = path.resolve();

// --------------------
// Database
// --------------------
connectDB();

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://jarro-linkedin.onrender.com" // your deployed frontend
        : "http://localhost:5173",             // local dev
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// --------------------
// API Routes
// --------------------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);

// --------------------
// Serve frontend (ONLY in production)
// --------------------
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirnameResolved, "frontend", "dist");
  app.use(express.static(clientPath));

  // Safe catch-all for React routing
  app.use((req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});