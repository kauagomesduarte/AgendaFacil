
import type { Request, Response, NextFunction } from "express";
import * as employeeService from "../services/employee.service.js";
import type { CompanyRole } from "../../generated/prisma/client.js";
import { AppError } from "../utils/appError.js";
import type { Company } from "../../generated/prisma/client.js";

function parseId(value: string | string[] | undefined): number {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new AppError("Invalid ID.", 400);
    }

    return id;
}

export async function addEmployee(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        console.log("chegou aqui")
        const companyId = parseId(req.params.companyId);
        const userId = parseId(req.body.userId);
        const { role } = req.body as { role: CompanyRole };

        const employee = await employeeService.addEmployee(
            userId,
            companyId,
            role
        );

        return res.status(201).json(employee);
    } catch (error) {
        next(error);
    }
}

export async function updateRole(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const reqUserRole = req.user?.role;
        if(!reqUserRole) throw new AppError("Missing request user", 404);

        const companyId = parseId(req.params.companyId);
        const employeeId = parseId(req.params.employeeId);
        const { role } = req.body as { role: CompanyRole };

        const employee = await employeeService.updateRole(
            reqUserRole,
            employeeId,
            companyId,
            role
        );

        return res.status(200).json(employee);
    } catch (error) {
        next(error);
    }
}

export async function findEmployee(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const companyId = parseId(req.params.companyId);
        const userId = parseId(req.params.userId);

        const employee = await employeeService.findEmployee(
            userId,
            companyId
        );

        return res.status(200).json(employee);
    } catch (error) {
        next(error);
    }
}

export async function findAllEmployee(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        console.log("chegou aqui")
        const companyId = parseId(req.params.companyId);

        const employees = await employeeService.findAllEmployee(companyId);

        return res.status(200).json(employees);
    } catch (error) {
        next(error);
    }
}

export async function removeEmployee(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
         const reqUserRole = req.user?.role;
        if(!reqUserRole) throw new AppError("Missing request user", 404);


        const companyId = parseId(req.params.companyId);
        const employeeId = parseId(req.params.employeeId);

        await employeeService.removeEmployee(reqUserRole, employeeId, companyId);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}
