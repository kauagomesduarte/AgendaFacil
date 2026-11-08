import express from "express";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

//cookieParser tem que ficar antes
app.use(cookieParser());
app.use(express.json());
app.use(router);

export default app;