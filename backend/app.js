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

// app.use(cors())
app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true, 
  }));

app.use(cookieParser());
app.get("/", (req, res) => {
    res.json("BACKEND IS WORKING");
  });
  
app.use("/user", user);
app.use("/auth", auSign);

export { app };
