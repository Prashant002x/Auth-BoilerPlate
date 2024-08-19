import express from "express";
import cors from "cors";
import user from './routes/user.routes.js'; 
import auSign from './routes/auth.routes.js'; 
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: "https://auth-boiler-plate-qx51.vercel.app/",
    credentials: true
}));

app.use(cookieParser());

app.use("/api/v1/user", user);
app.use("/api/v1/auth", auSign);

export { app };
