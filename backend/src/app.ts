import express from "express";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.mw.js";

const app = express();

//cookieParser tem que ficar antes
app.use(cookieParser());
app.use(express.json());
app.use(router);
// Tratamento global de erros
app.use(errorHandler);

export default app;