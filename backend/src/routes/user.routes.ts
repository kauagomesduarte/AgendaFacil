import { Router } from 'express';
import { createUser, findUserById, getUsers, deleteUserById, updateUserById } from '../controllers/user.controller.js';
import { validateCreateUser, validateUpdateUser } from '../middlewares/userValidate.mw.js';
import { validateToken } from '../middlewares/auth.mw.js';

const router = Router();

//Rotas 
router.post(
    "/",
    validateCreateUser,
    createUser
);

router.get(
    "/:id", 
    findUserById
);

router.patch(
    "/:id",
    validateToken,
    validateUpdateUser,
    updateUserById
);

/*
router.get(
    "/", 
    getUsers
); */

/*router.delete(
    "/:id", 
    validateToken,
    deleteUserById
); */

export default router;