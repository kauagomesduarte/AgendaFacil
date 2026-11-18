import { prisma } from "../libs/prisma.js";

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
    return prisma.service.delete({
        where: {
            id: serviceId,
            companyId
        }
    });
}

// Relação funcionário-serviço

export async function assignService(
    companyUserId: number,
    serviceId: number
) {
    return prisma.employeeService.create({
        data: {
            companyUserId,
            serviceId
        }
    });
}

export async function removeServiceAssignment(
    companyUserId: number,
    serviceId: number
) {
    return prisma.employeeService.delete({
        where: {
            companyUserId_serviceId: {
                companyUserId,
                serviceId
            }
        }
    });
}

export async function findEmployeeServices(
    companyUserId: number
) {
    return prisma.employeeService.findMany({
        where: { companyUserId },
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
