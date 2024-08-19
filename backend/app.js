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
    origin: "https://auth-boilerplate-2.onrender.com",
    credentials: true
}));

app.use(cookieParser());

app.use("/user", user);
app.use("/auth", auSign);

export { app };
