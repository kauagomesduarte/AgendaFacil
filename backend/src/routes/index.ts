import { Router } from 'express';
const router = Router();

// Rotas de usuários
import userRoutes from "./user.routes.js";
router.use("/users", userRoutes);

export default router;