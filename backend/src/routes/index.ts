import { validateToken } from '../middlewares/auth.mw.js';
import { Router } from 'express';
const router = Router();

// Rotas de usuários
import userRoutes from "./user.routes.js";
router.use("/users", userRoutes);

import authRoutes from "./auth.routes.js";
router.use("/auth", authRoutes)

import companyRoutes from "./company.routes.js"
router.use("/comp", validateToken, companyRoutes)

export default router;