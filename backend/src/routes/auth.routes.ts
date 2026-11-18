import { Router } from 'express';
import { validateLogin } from '../middlewares/auth.mw.js';
import { validateToken } from '../middlewares/auth.mw.js';
import {
    authenticateUser,
    getAuthenticatedUser,
    logout
} from '../controllers/auth.controller.js';

const router = Router();

router.post(
    "/login",
    validateLogin,
    authenticateUser
);

router.get(
    "/me",
    validateToken,
    getAuthenticatedUser
);

router.post(
    "/logout",
    logout
);

export default router;