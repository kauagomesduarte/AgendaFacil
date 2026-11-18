import * as userRepository from "../repositories/user.repository.js";
import type { CreateUserDTO, PublicUserDTO, UpdateUserDTO } from "../dtos/user.dto.js";
import bcrypt from 'bcrypt';
import { AppError } from "../utils/appError.js";
import { Prisma } from "../../generated/prisma/client.js";


 
export async function createUser(data: CreateUserDTO): Promise<void>{
    if(!data){throw new Error("Invalid data.");}

    const existingUser = await userRepository.findByEmail(data.email);
    if(existingUser !== null) throw new AppError("E-mail already registered", 400);
    
    const hashPassword = await bcrypt.hash(data.password, 12);
    const newData = {
        ...data,
        password: hashPassword
    }
    await userRepository.createUser(newData);
}

export async function findById(userId: number): Promise<PublicUserDTO>{
    const user = await userRepository.findById(userId);

    if (!user) throw new AppError("Usuário não encontrado", 404);

    return user;
}

export async function updateUserById(userId: number, newData: UpdateUserDTO): Promise<PublicUserDTO>{
    let cleanedData = Object.fromEntries(
        Object.entries(newData).filter(([key, value]) => value !== undefined)
    );

    if (cleanedData.password){
        cleanedData = {
            ...cleanedData,
            password: await bcrypt.hash(cleanedData.password, 12)
        }
    }

    try {
        return await userRepository.updateUserById(userId, cleanedData);
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            throw new AppError("Usuário não encontrado", 404);
        }
        throw error;
    }
}

export async function deleteUserById(userId: number): Promise<void>{
    const result = await userRepository.deleteUserById(userId);
    if(!result) throw new AppError("Usuário inválido", 400);
}

export async function getUsers(): Promise<PublicUserDTO[]>{
    return await userRepository.getUsers();
}