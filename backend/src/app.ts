import express from "express";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.mw.js";

const app = express();

const configuredOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ...configuredOrigins,
]);

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.has(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    }

    if (req.method === "OPTIONS") {
        return res.sendStatus(origin && allowedOrigins.has(origin) ? 204 : 403);
    }

    next();
});

//cookieParser tem que ficar antes
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use((_req, res) => {
    return res.status(404).json({
        message: "Route not found"
    });
});
// Tratamento global de erros
app.use(errorHandler);

export default app;