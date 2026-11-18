
import { prisma } from "../libs/prisma.js";
import type { CompanyRole } from "../../generated/prisma/client.js";
import { AppError } from "../utils/appError.js";
import { hasActiveFutureAppointments, hasAnyAppointments } from "./appointment.repository.js";
import { lockCompany, lockCompanyUser } from "./transactionLocks.js";

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
    return prisma.$transaction(async tx => {
        await lockCompany(tx, companyId, "SHARE");
        await lockCompanyUser(tx, employeeId, "UPDATE");
        const employee = await tx.companyUser.findFirst({
            where: { id: employeeId, companyId }
        });
        if (!employee) throw new AppError("Employee not found.", 404);

        const now = new Date();
        if (await hasActiveFutureAppointments(tx, { companyUserId: employeeId }, now)) {
            throw new AppError(
                "Employee has future appointments that must be resolved first.",
                409
            );
        }
        if (await hasAnyAppointments(tx, { companyUserId: employeeId })) {
            throw new AppError(
                "Employee cannot be removed while appointment history exists.",
                409
            );
        }

        return tx.companyUser.delete({
            where: { id: employeeId }
        });
    });
}
