import * as userRepository from "../repository/user.repository.js";
import type { UpdateUserDTO, UserDTO } from "../dtos/user.dto.js";
import type { User } from "../../generated/prisma/browser.js";

 
export async function createUser(data: UserDTO){
    if(!data){throw new Error("Invalid data.");}

    await userRepository.createUser(data);
}

export async function findById(userId: number){
    return await userRepository.findById(userId);
}

export async function updateUserById(userId: number, newData: UpdateUserDTO): Promise<UserDTO>{
        const user = await userRepository.updateUserById(userId, newData);
        return user;   
}

export async function deleteUserById(userId: number): Promise<void>{
    const result = await userRepository.deleteUserById(userId);
    if(!result){throw new Error("Usuário inválido")}
}

export async function getUsers(){
    return await userRepository.getUsers();
}