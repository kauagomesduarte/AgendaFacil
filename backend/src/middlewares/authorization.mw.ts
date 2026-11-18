import type { Request, Response, NextFunction } from "express";
import { findEmployee, findEmployeeById } from "../repositories/employee.repository.js";
import { AppError } from "../utils/appError.js";
import  { CompanyRole } from "../../generated/prisma/enums.js";
import { prisma } from "../libs/prisma.js";

export function authorizeByRole(roles: CompanyRole[]) {
    
    return async function(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const user = req.user;
        const reqUserId = user?.id;
        if (!user || !reqUserId) throw new AppError("No authentication", 401);

        const companyId = Number(req.params.companyId ?? req.params.id);
        if (!Number.isInteger(companyId) || companyId <= 0) {
            throw new AppError("Invalid company ID", 400);
        }

        const company = await prisma.company.findUnique({
            where: { id: companyId },
            select: { id: true }
        });
        if (!company) {
            throw new AppError("Company not found", 404);
        }

        const reqEmployeeData = await findEmployee(reqUserId, companyId);
        if (!reqEmployeeData) {
            throw new AppError("User is not registered in this company", 403);
        }

        if (roles.length > 0 && !roles.includes(reqEmployeeData.role)) {
            throw new AppError("Unauthorized role", 403);
        }

        user.role = reqEmployeeData.role;
        next();
    };
}