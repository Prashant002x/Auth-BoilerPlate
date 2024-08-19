import express from "express";
import cors from "cors";
import user from './routes/user.routes.js'; 
import auSign from './routes/auth.routes.js'; 
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize Express App
const app = express();

// Determine __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.static(path.join(__dirname, '/client/dist')));
app.use(cookieParser());

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Define Routes
app.use("/api/v1/user", user);
app.use("/api/v1/auth", auSign);

export { app };
