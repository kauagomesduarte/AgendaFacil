import { Router } from 'express';
import { validateLogin } from '../middlewares/auth.mw.js';
import { authenticateUser } from '../controllers/auth.controller.js';

const router = Router();

router.post(
    "/login",
    validateLogin,
    authenticateUser
);

export default router;