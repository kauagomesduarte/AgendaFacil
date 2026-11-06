import {prisma} from "../libs/prisma.js";
import {Prisma} from "../../generated/prisma/client.js"
import type {User} from "../../generated/prisma/client.js"

export async function createUser(data: Prisma.UserCreateInput){
    return await prisma.user.create({data});
}

export async function findById(userId: number): Promise<User | null> {
    return await prisma.user.findUnique({
        where: {
            id : userId
        }
    });
}

export async function findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
        where: {
            email : email
        }
    });
}


export async function updateUserById(userId: number, newData: Prisma.UserUpdateInput): Promise<User>{
    const newUser = await prisma.user.update({
        where:{
            id: userId
        },
        data:{
            ...newData
        }
    });

    return newUser;
}

export async function deleteUserById(userId: number): Promise<boolean>{
    const user = await prisma.user.delete({
        where: {
            id: userId
        }
    });

    return true;
}

export async function getUsers(): Promise<User[]>{
    return await prisma.user.findMany();
}
