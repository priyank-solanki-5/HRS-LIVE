import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./config/database.js";
import UserRouter from "./routes/user.route.js";
import EventRouter from "./routes/event.route.js";
import JobRouter from "./routes/job.route.js";
import JobApplicationRouter from "./routes/jobApplication.route.js";
import AdminRouter from "./routes/admin.route.js";
import AdmissionRouter from "./routes/admission.route.js";
import HomeStatsRouter from "./routes/homeStats.route.js";
import ParentRouter from "./routes/parent.route.js";
import ContactRouter from "./routes/contact.route.js";
import ActivityRouter from "./routes/activity.route.js";
import { ensureDefaultAdmin } from "./services/admin.services.js";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// CORS configuration for cookies
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Lightweight health check (does not depend on DB)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API routes only (backend-only server)
app.use("/api/users", UserRouter);
app.use("/api/events", EventRouter);
app.use("/api/jobs", JobRouter);
app.use("/api/job-applications", JobApplicationRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/admissions", AdmissionRouter);
app.use("/api/home-stats", HomeStatsRouter);
app.use("/api/parents", ParentRouter);
app.use("/api/contacts", ContactRouter);
app.use("/api/activities", ActivityRouter);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectToDatabase();
  // Seed default admin if not present
  const seedEmail = process.env.ADMIN_EMAIL || "priyank687@gmail.com";
  const seedPassword = process.env.ADMIN_PASSWORD || "admin@123";
  await ensureDefaultAdmin(seedEmail, seedPassword);
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
