import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./api/routes/user.route.js";
import authRouter from "./api/routes/auth.route.js";
import postRouter from "./api/routes/post.route.js";
import commentRoutes from "./api/routes/comment.route.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
// const allowedOrigins = [process.env.LOCALHOST, process.env.WEB_SITE];
app.use(cors({ origin: process.env.WEB_SITE, credentials: true }));

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connect to data base");
  })
  .catch((error) => {
    console.log(error);
  });
app.use(cookieParser());
app.listen(process.env.PORT, () => {
  console.log("Server is running...");
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
