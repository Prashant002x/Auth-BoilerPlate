import express from "express";
import cors from "cors";
import user from './routes/user.routes.js'; // Ensure the path is correct
import auSign from './routes/auth.routes.js'; // Ensure the path is correct

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Mount the user routes under `/api/v1/thank`
app.use("/api/v1/user", user);

// Mount the auth routes under `/api/v1/auth`
app.use("/api/v1/auth", auSign);

export { app };
