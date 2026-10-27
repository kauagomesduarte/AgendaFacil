import { Router } from 'express';
import { createUser, findUserById, getUsers, deleteUserById, updateUserById } from '../controllers/user.controller.js';

const router = Router();

//Rotas 
router.post("/", createUser);
router.get("/:id", findUserById);
router.put("/:id", updateUserById);
router.get("/", getUsers);
router.delete("/:id", deleteUserById);

export default router;