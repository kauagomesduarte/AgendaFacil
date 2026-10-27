import express from "express";
import router from "./routes/index.js";

const app = express();

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Registra as rotas de usuários
app.use(router);

export default app;