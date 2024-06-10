import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.routes.js";
import studentsRoutes from "./src/routes/students.routes.js";
import teachersRoutes from "./src/routes/teachers.routes.js";
import academicsRoutes from "./src/routes/academics.routes.js";

// config
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/ping", async (req, res) => {
  res.json({ message: "pong" });
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentsRoutes);
app.use("/api/v1/teachers", teachersRoutes);
app.use("/api/v1/academics", academicsRoutes);

// server port
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
