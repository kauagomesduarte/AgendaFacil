import {prisma} from "../libs/prisma.js";
import {Prisma} from "../../generated/prisma/client.js"
import type {User} from "../../generated/prisma/client.js"
import { AppError } from "../utils/appError.js";

export async function createUser(data: Prisma.UserCreateInput){
    return await prisma.user.create({data});
}

export async function findByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email }
    });
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
    return prisma.$transaction(async tx => {
        await tx.$queryRaw`SELECT "id" FROM "users" WHERE "id" = ${userId} FOR UPDATE`;
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: { id: true }
        });
        if (!user) return false;

        const companyMembershipCount = await tx.companyUser.count({
            where: { userId }
        });
        const appointmentCount = await tx.appointment.count({
            where: { customerUserId: userId }
        });
        if (companyMembershipCount > 0 || appointmentCount > 0) {
            throw new AppError(
                "User cannot be deleted while company memberships or appointment history exist.",
                409
            );
        }

        await tx.user.delete({ where: { id: userId } });
        return true;
    });
}
