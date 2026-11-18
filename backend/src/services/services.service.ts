
import * as serviceRepository from "../repositories/services.repository.js";
import { AppError } from "../utils/appError.js";
import { hasPostgresErrorCode } from "../utils/prismaErrors.js";

export async function createService(
    companyId: number,
    name: string,
    price: number,
    durationMinutes: number
) {
    if (price < 0 || !Number.isFinite(price)) {
        throw new AppError("Invalid service price.", 400);
    }

    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
        throw new AppError("Invalid service duration.", 400);
    }

    return serviceRepository.addService(
        companyId,
        name,
        price,
        durationMinutes
    );
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
    const service = await serviceRepository.findService(
        serviceId,
        companyId
    );

    if (!service) {
        throw new AppError("Service not found.", 404);
    }

    if (data.price !== undefined &&
        (data.price < 0 || !Number.isFinite(data.price))) {
        throw new AppError("Invalid service price.", 400);
    }

    if (data.durationMinutes !== undefined &&
        (!Number.isInteger(data.durationMinutes) ||
        data.durationMinutes <= 0)) {
        throw new AppError("Invalid service duration.", 400);
    }

    return serviceRepository.updateService(
        serviceId,
        companyId,
        data
    );
}

export async function getService(
    serviceId: number,
    companyId: number
) {
    const service = await serviceRepository.findService(
        serviceId,
        companyId
    );

    if (!service) {
        throw new AppError("Service not found.", 404);
    }

    return service;
}

export async function getAllServices(companyId: number) {
    return serviceRepository.findAllServices(companyId);
}

export async function deleteService(
    serviceId: number,
    companyId: number
) {
    const service = await serviceRepository.findService(
        serviceId,
        companyId
    );

    if (!service) {
        throw new AppError("Service not found.", 404);
    }

    return serviceRepository.removeService(
        serviceId,
        companyId
    );
}

// Associação entre funcionários e serviços

export async function assignEmployeeService(
    employeeId: number,
    serviceId: number,
    companyId: number
) {
    const service = await serviceRepository.findService(
        serviceId,
        companyId
    );

    if (!service) {
        throw new AppError("Service not found.", 404);
    }

    const employee = await serviceRepository.findEmployeeInCompany(
        employeeId,
        companyId
    );

    if (!employee) {
        throw new AppError("Employee not found.", 404);
    }

    try {
        return await serviceRepository.assignService(
            companyId,
            employeeId,
            serviceId
        );
    } catch (error) {
        if (hasPostgresErrorCode(error, "P2002")) {
            throw new AppError("Employee is already assigned to this service.", 409);
        }
        throw error;
    }
}

export async function removeEmployeeService(
    employeeId: number,
    serviceId: number,
    companyId: number
) {
    const service = await serviceRepository.findService(
        serviceId,
        companyId
    );

    if (!service) {
        throw new AppError("Service not found.", 404);
    }

    const employee = await serviceRepository.findEmployeeInCompany(
        employeeId,
        companyId
    );

    if (!employee) {
        throw new AppError("Employee not found.", 404);
    }

    return serviceRepository.removeServiceAssignment(
        companyId,
        employeeId,
        serviceId
    );
}

export async function getEmployeeServices(
    employeeId: number,
    companyId: number
) {
    const employee = await serviceRepository.findEmployeeInCompany(
        employeeId,
        companyId
    );

    if (!employee) {
        throw new AppError("Employee not found.", 404);
    }

    return serviceRepository.findEmployeeServices(employeeId, companyId);
}
