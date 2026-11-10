import { Router } from 'express';
const router = Router();

// Rotas de usuários
import userRoutes from "./user.routes.js";
router.use("/users", userRoutes);

import authRoutes from "./auth.routes.js";
router.use("/auth", authRoutes)

export default router;