// Import necessary modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers
app.use(express.json()); // Parse JSON request body

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Adventura API!" });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
