import {prisma} from "../libs/prisma.js";
import {Prisma} from "../../generated/prisma/client.js"
import type {User} from "../../generated/prisma/client.js"

export async function createUser(data: Prisma.UserCreateInput){
    return await prisma.user.create({data});
}

export async function findById(userId: number) {
    return await prisma.user.findUnique({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    });
}

export async function updateUserById(
    userId: number,
    newData: Prisma.UserUpdateInput
) {
    return await prisma.user.update({
        where: {
            id: userId
        },
        data: newData,
        omit: {
            password: true
        }
    });
}

export async function getUsers() {
    return await prisma.user.findMany({
        omit: {
            password: true
        }
    });
}

export async function deleteUserById(userId: number): Promise<boolean>{
    const user = await prisma.user.delete({
        where: {
            id: userId
        }
    });

    return true;
}
