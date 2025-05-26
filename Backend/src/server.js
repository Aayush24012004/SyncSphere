import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth/", authRoutes);
app.use("/api/users/", userRoutes);
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
