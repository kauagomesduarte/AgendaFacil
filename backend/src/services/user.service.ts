import * as userRepository from "../repository/user.repository.js";
import type { UpdateUserDTO, UserDTO } from "../dtos/user.dto.js";
import type { User } from "../../generated/prisma/browser.js";
import bcrypt from 'bcrypt';


 
export async function createUser(data: UserDTO): Promise<void>{
    if(!data){throw new Error("Invalid data.");}

    const existingUser = await userRepository.findByEmail(data.email);
    if(existingUser !== null) throw new Error("E-mail already registered");
    
    const hashPassword = await bcrypt.hash(data.password, 12);
    const newData = {
        ...data,
        password: hashPassword
    }
    await userRepository.createUser(newData);
}

export async function findById(userId: number): Promise<User>{
    const user = await userRepository.findById(userId);

    if (!user) throw new Error("Usuário não encontrado");

    return user;
}

export async function updateUserById(userId: number, newData: UpdateUserDTO): Promise<UserDTO>{
    let cleanedData = Object.fromEntries(
        Object.entries(newData).filter(([key, value]) => value !== undefined)
    );

    if (cleanedData.password){
        cleanedData = {
            ...cleanedData,
            password: await bcrypt.hash(cleanedData.password, 12)
        }
    }

    const user = await userRepository.updateUserById(userId, cleanedData);
    return user;   
}

export async function deleteUserById(userId: number): Promise<void>{
    const result = await userRepository.deleteUserById(userId);
    if(!result) throw new Error("Usuário inválido");
}

export async function getUsers(): Promise<User[]>{
    return await userRepository.getUsers();
}