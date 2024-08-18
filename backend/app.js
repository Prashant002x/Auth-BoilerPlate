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
// app.use(cors({
//     origin: 'http://localhost:5173', // Hardcoded origin
//     credentials: true
// }));


//
app.use("/api/v1/user", user);

app.use("/api/v1/auth", auSign);

export { app };
