import express from "express";
import cors from "cors";
import user from './routes/user.routes.js'; 
import auSign from './routes/auth.routes.js'; 
import cookieParser from "cookie-parser";
const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"))
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
app.use(cookieParser());
// app.use(cors({
//     origin: 'http://localhost:5173', // Hardcoded origin
//     credentials: true
// }));


//
app.use("/api/v1/user", user);

app.use("/api/v1/auth", auSign);

export { app };
