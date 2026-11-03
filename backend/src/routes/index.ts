import { Router } from 'express';
const router = Router();

// Rotas de usuários
import userRoutes from "./userRoutes.js";
router.use("/users", userRoutes);

export default router;