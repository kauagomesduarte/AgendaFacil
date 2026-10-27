import * as userService from "../services/user.service.js";
import type { Request, Response } from "express";

export async function createUser(req: Request, res: Response){
    const { name } = req.body;
    const user = await userService.createUser({
        name
    });
    return res.status(201).json({message: "Usuário criado"});
}

export async function findUserById(req: Request, res: Response){
    const id: number = Number(req.params.id);
    const user = await userService.findById(id);
    return res.status(200).json(user);
}

export async function updateUserById(req: Request, res: Response) {
    const id: number = Number(req.params.id);
    const { name } = req.body;
    const newData = {name}
    userService.updateUserById(id, newData);
    return res.status(200).json("Usuário atualizado");
}

export async function deleteUserById(req: Request, res: Response){
    const id: number = Number(req.params.id);
    await userService.deleteUserById(id);
    return res.status(200).json("User deleted.")
}

export async function getUsers(req: Request, res: Response){
    const users = await userService.getUsers();
    return res.status(200).json(users);
}