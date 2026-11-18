import type { NextFunction, Request, Response } from "express";
import * as schedulesService from "../services/schedules.service.js";
import { AppError } from "../utils/appError.js";

function parseId(value: string | string[] | undefined): number {
    const id = Number(value);
    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new AppError("Invalid ID.", 400);
    }
    return id;
}

export async function getSchedules(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const companyUserId = parseId(req.params.employeeId);
        const companyId = parseId(req.params.companyId);
        const user = req.user;
        if (!user?.role) throw new AppError("No authentication.", 401);

        const schedules = await schedulesService.getSchedules(
            companyUserId,
            companyId,
            user.id,
            user.role
        );
        return res.status(200).json(schedules);
    } catch (error) {
        next(error);
    }
}

export async function createSchedule(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const schedule = await schedulesService.createSchedule(
            parseId(req.params.employeeId),
            parseId(req.params.companyId),
            req.body
        );
        return res.status(201).json(schedule);
    } catch (error) {
        next(error);
    }
}

export async function updateSchedule(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const schedule = await schedulesService.updateSchedule(
            parseId(req.params.scheduleId),
            parseId(req.params.employeeId),
            parseId(req.params.companyId),
            req.body
        );
        return res.status(200).json(schedule);
    } catch (error) {
        next(error);
    }
}

export async function deleteSchedule(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await schedulesService.deleteSchedule(
            parseId(req.params.scheduleId),
            parseId(req.params.employeeId),
            parseId(req.params.companyId)
        );
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}
