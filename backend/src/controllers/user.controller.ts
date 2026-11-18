import * as userService from "../services/user.service.js";
import type {CreateUserDTO, UpdateUserDTO} from "../dtos/user.dto.js";
import type { Request, Response } from "express";
import z from 'zod';
import { AppError } from "../utils/appError.js";

function parseId(value: string | undefined): number {
    const id = Number(value);
    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new AppError("Invalid ID.", 400);
    }
    return id;
}

export async function createUser(req: Request, res: Response){
    const data: CreateUserDTO = req.body;
    await userService.createUser(data);
    return res.status(201).json({message: "Usuário criado"});
}

export async function findUserById(req: Request, res: Response){
    const id = parseId(req.params.id);
    const user = await userService.findById(id);
    return res.status(200).json(user);
}

export async function updateUserById(req: Request, res: Response) {
    const id = parseId(req.params.id);
    const authenticatedUserId = req.user?.id;
    if (authenticatedUserId !== id) {
        throw new AppError("You can only update your own account.", 403);
    }
    const newData: UpdateUserDTO = req.body;
    const newUser = await userService.updateUserById(id, newData);
    return res.status(200).json(newUser);
}

export async function deleteUserById(req: Request, res: Response){
    const id: number = Number(req.params.id);
    await userService.deleteUserById(id);
    return res.status(200).json({message: "User deleted"});
}

export async function getUsers(req: Request, res: Response){
    const users = await userService.getUsers();
    return res.status(200).json(users);
}