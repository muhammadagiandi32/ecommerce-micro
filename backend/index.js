import express from "express";
import cors from "cors";
import UserRouter from "./router/UserRouter.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use(UserRouter);
app.listen(5000, () => console.log("server sedang berjalan port 5000..."));
