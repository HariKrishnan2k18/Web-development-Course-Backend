import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import connectDB from "./Database/config.js";

const app = express();
app.use(express.json());
dotenv.config();

app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

app.use("/users", userRouter);

connectDB();

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
