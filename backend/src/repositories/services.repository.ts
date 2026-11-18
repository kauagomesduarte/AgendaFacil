import { prisma } from "../libs/prisma.js";
import { AppError } from "../utils/appError.js";
import { hasActiveFutureAppointments, hasAnyAppointments } from "./appointment.repository.js";
import { lockCompany, lockCompanyUser, lockService } from "./transactionLocks.js";

export async function addService(
    companyId: number,
    name: string,
    price: number,
    durationMinutes: number
) {
    return prisma.service.create({
        data: {
            companyId,
            name,
            price,
            durationMinutes
        }
    });
}

export async function updateService(
    serviceId: number,
    companyId: number,
    data: {
        name?: string;
        price?: number;
        durationMinutes?: number;
    }
) {
    return prisma.service.update({
        where: {
            id: serviceId,
            companyId
        },
        data
    });
}

export async function findService(
    serviceId: number,
    companyId: number
) {
    return prisma.service.findFirst({
        where: {
            id: serviceId,
            companyId
        }
    });
}

export async function findAllServices(companyId: number) {
    return prisma.service.findMany({
        where: { companyId }
    });
}

export async function removeService(
    serviceId: number,
    companyId: number
) {
    return prisma.$transaction(async tx => {
        await lockCompany(tx, companyId, "SHARE");
        await lockService(tx, serviceId, "UPDATE");
        const service = await tx.service.findFirst({
            where: { id: serviceId, companyId },
            select: { id: true }
        });
        if (!service) throw new AppError("Service not found.", 404);

        const now = new Date();
        if (await hasActiveFutureAppointments(tx, { serviceId }, now)) {
            throw new AppError(
                "Service has future appointments that must be resolved first.",
                409
            );
        }
        if (await hasAnyAppointments(tx, { serviceId })) {
            throw new AppError(
                "Service cannot be deleted while appointment history exists.",
                409
            );
        }

        return tx.service.delete({ where: { id: serviceId } });
    });
}

// Relação funcionário-serviço

export async function assignService(
    companyId: number,
    companyUserId: number,
    serviceId: number
) {
    return prisma.$transaction(async tx => {
        await lockCompany(tx, companyId, "SHARE");
        await lockService(tx, serviceId, "SHARE");
        await lockCompanyUser(tx, companyUserId, "UPDATE");
        const [service, employee] = await Promise.all([
            tx.service.findFirst({ where: { id: serviceId, companyId } }),
            tx.companyUser.findFirst({ where: { id: companyUserId, companyId } })
        ]);
        if (!service) throw new AppError("Service not found.", 404);
        if (!employee) throw new AppError("Employee not found.", 404);

        return tx.employeeService.create({
            data: { companyUserId, serviceId }
        });
    });
}

export async function removeServiceAssignment(
    companyId: number,
    companyUserId: number,
    serviceId: number
) {
    return prisma.$transaction(async tx => {
        await lockCompany(tx, companyId, "SHARE");
        await lockService(tx, serviceId, "UPDATE");
        await lockCompanyUser(tx, companyUserId, "UPDATE");
        const assignment = await tx.employeeService.findUnique({
            where: {
                companyUserId_serviceId: { companyUserId, serviceId }
            },
            include: { companyUser: true, service: true }
        });
        if (
            !assignment ||
            assignment.companyUser.companyId !== companyId ||
            assignment.service.companyId !== companyId
        ) {
            throw new AppError("Employee-service assignment not found.", 404);
        }

        const now = new Date();
        const scope = { companyUserId, serviceId };
        if (await hasActiveFutureAppointments(tx, scope, now)) {
            throw new AppError(
                "This assignment has future appointments that must be resolved first.",
                409
            );
        }
        if (await hasAnyAppointments(tx, scope)) {
            throw new AppError(
                "This assignment cannot be removed while appointment history exists.",
                409
            );
        }

        return tx.employeeService.delete({
            where: { companyUserId_serviceId: { companyUserId, serviceId } }
        });
    });
}

export async function findEmployeeServices(
    companyUserId: number,
    companyId: number
) {
    return prisma.employeeService.findMany({
        where: {
            companyUserId,
            companyUser: { companyId },
            service: { companyId }
        },
        include: {
            service: true
        }
    });
}

export async function findEmployeeInCompany(
    employeeId: number,
    companyId: number
) {
    return prisma.companyUser.findFirst({
        where: {
            id: employeeId,
            companyId
        }
    });
}
