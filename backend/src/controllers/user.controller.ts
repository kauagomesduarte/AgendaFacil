import * as userService from "../services/user.service.js";
import type {UpdateUserDTO, UserDTO} from "../dtos/user.dto.js";
import type { Request, Response } from "express";

export async function createUser(req: Request, res: Response){
    const data: UserDTO = req.body;
    await userService.createUser(data);
    return res.status(201).json({message: "Usuário criado"});
}

export async function findUserById(req: Request, res: Response){
    const id: number = Number(req.params.id);
    const user = await userService.findById(id);
    return res.status(200).json(user);
}

export async function updateUserById(req: Request, res: Response) {
    const id: number = Number(req.params.id);
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