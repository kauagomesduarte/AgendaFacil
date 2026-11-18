
import { prisma } from "../libs/prisma.js";
import type { CompanyRole } from "../../generated/prisma/client.js";

export async function addEmployee(
    userId: number,
    companyId: number,
    role: CompanyRole
) {
    return prisma.companyUser.create({
        data: {
            userId,
            companyId,
            role
        }
    });
}

export async function updateRole(
    employeeId: number,
    companyId: number,
    role: CompanyRole
) {
    return prisma.companyUser.update({
        where: {
            id: employeeId,
            companyId
        },
        data: { role }
    });
}

export async function findEmployee(
    userId: number,
    companyId: number
) {
    return prisma.companyUser.findFirst({
        where: {
            userId,
            companyId
        }
    });
}


export async function findEmployeeById(
    employeeId: number
) {
    return prisma.companyUser.findUnique({
        where: {
            id: employeeId
        }
    });
}


export async function findAllEmployee(companyId: number) {
    return prisma.companyUser.findMany({
        where: { companyId }
    });
}

export async function removeEmployee(
    employeeId: number,
    companyId: number
) {
    return prisma.companyUser.delete({
        where: {
            id: employeeId,
            companyId
        }
    });
}
