// --------------------
// Environment variables
// --------------------
import dotenv from "dotenv";
dotenv.config();

// --------------------
// Third-party packages
// --------------------
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

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
// App & config
// --------------------
const app = express();
const PORT = process.env.PORT || 5000;

// Correct __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirnameResolved = path.dirname(__filename);

// --------------------
// Connect to DB
// --------------------
connectDB();

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://jarro-linkedin.onrender.com" // your frontend URL
        : "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// --------------------
// API Routes
// --------------------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);

// --------------------
// Serve frontend (production only)
// --------------------
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirnameResolved, "../frontend/dist");
  app.use(express.static(frontendDist));

  // Express 5-safe catch-all
  app.use((req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});