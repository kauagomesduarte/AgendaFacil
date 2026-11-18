
import type { Request, Response, NextFunction } from "express";
import * as serviceService from "../services/services.service.js";

export async function createService(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const companyId = Number(req.params.companyId);
        const { name, price, durationMinutes } = req.body;

        const service = await serviceService.createService(
            companyId,
            name,
            price,
            durationMinutes
        );

        return res.status(201).json(service);
    } catch (error) {
        next(error);
    }
}

export async function updateService(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const companyId = Number(req.params.companyId);
        const serviceId = Number(req.params.serviceId);

        const service = await serviceService.updateService(
            serviceId,
            companyId,
            req.body
        );

        return res.status(200).json(service);
    } catch (error) {
        next(error);
    }
}

export async function getService(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const companyId = Number(req.params.companyId);
        const serviceId = Number(req.params.serviceId);

        const service = await serviceService.getService(
            serviceId,
            companyId
        );

        return res.status(200).json(service);
    } catch (error) {
        next(error);
    }
}

export async function getAllServices(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const companyId = Number(req.params.companyId);

        const services = await serviceService.getAllServices(
            companyId
        );

        return res.status(200).json(services);
    } catch (error) {
        next(error);
    }
}

export async function deleteService(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const companyId = Number(req.params.companyId);
        const serviceId = Number(req.params.serviceId);

        await serviceService.deleteService(
            serviceId,
            companyId
        );

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

// Associação funcionário-serviço

export async function assignEmployeeService(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const companyId = Number(req.params.companyId);
        const employeeId = Number(req.params.employeeId);
        const serviceId = Number(req.params.serviceId);

        const assignment = await serviceService.assignEmployeeService(
            employeeId,
            serviceId,
            companyId
        );

        return res.status(201).json(assignment);
    } catch (error) {
        next(error);
    }
}

export async function removeEmployeeService(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const companyId = Number(req.params.companyId);
        const employeeId = Number(req.params.employeeId);
        const serviceId = Number(req.params.serviceId);

        await serviceService.removeEmployeeService(
            employeeId,
            serviceId,
            companyId
        );

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function getEmployeeServices(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const companyId = Number(req.params.companyId);
        const employeeId = Number(req.params.employeeId);

        const services = await serviceService.getEmployeeServices(
            employeeId,
            companyId
        );

        return res.status(200).json(services);
    } catch (error) {
        next(error);
    }
}
