import { isHigherRole } from "../utils/role.hierarchy.js";
import * as employeeRepository from "../repositories/employee.repository.js";
import type { CompanyRole } from "../../generated/prisma/client.js";
import { AppError } from "../utils/appError.js";

function isPrismaError(error: unknown, code: string): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === code
    );
}

export async function addEmployee(
    userId: number,
    companyId: number,
    role: CompanyRole
) {
    try {
        return await employeeRepository.addEmployee(
            userId,
            companyId,
            role
        );
    } catch (error) {
        if (isPrismaError(error, "P2002")) {
            throw new AppError("Employee already belongs to this company.", 409);
        }

        if (isPrismaError(error, "P2003")) {
            throw new AppError("User or company does not exist.", 404);
        }

        throw error;
    }
}

export async function updateRole(
    reqUserRole: CompanyRole,
    employeeId: number,
    companyId: number,
    role: CompanyRole
) {
    const employeeData = await employeeRepository.findEmployeeById(employeeId);
    if(!employeeData) throw new AppError("Employee not found.", 404);
    if(employeeData.companyId !== companyId) throw new AppError("Employee not found.", 404);
    if(employeeData.role === role) throw new AppError("Employee already has this role.", 400);
    

    if (!isHigherRole(reqUserRole, employeeData.role) || reqUserRole === role) {
        throw new AppError("Unauthorized action.", 403);
    }

    try {
        return await employeeRepository.updateRole(
            employeeId,
            companyId,
            role
        );
    } catch (error) {
        if (isPrismaError(error, "P2025")) {
            throw new AppError("Employee not found.", 404);
        }

        throw error;
    }
}

export async function findEmployee(
    userId: number,
    companyId: number
) {
    const employeeData = await employeeRepository.findEmployee(userId, companyId);
    if (!employeeData) throw new AppError("Employee not found.", 404);

    return employeeData;
}

export async function findAllEmployee(companyId: number) {
    return employeeRepository.findAllEmployee(companyId);
}

export async function removeEmployee(
    reqUserRole: CompanyRole,
    employeeId: number,
    companyId: number
) {
    const employeeData = await employeeRepository.findEmployeeById(employeeId);
    if(!employeeData) throw new AppError("Employee not found.", 404);
    if(employeeData.companyId !== companyId) throw new AppError("Employee not found.", 404);
    
    if (!isHigherRole(reqUserRole, employeeData.role)) {
        throw new AppError("Unauthorized action.", 403);
    }

    try {
        return await employeeRepository.removeEmployee(
            employeeId,
            companyId
        );
    } catch (error) {
        if (isPrismaError(error, "P2025")) {
            throw new AppError("Employee not found.", 404);
        }

        throw error;
    }
}
