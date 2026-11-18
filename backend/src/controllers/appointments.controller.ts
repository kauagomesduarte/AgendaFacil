import type { NextFunction, Request, Response } from "express";
import {
    availabilityQuerySchema,
    listAppointmentsQuerySchema
} from "../dtos/appointments.dto.js";
import * as appointmentsService from "../services/appointments.service.js";
import { AppError } from "../utils/appError.js";
import type { CompanyRole } from "../../generated/prisma/enums.js";

type TransitionAction = "confirm" | "reject" | "cancel" | "complete" | "no-show";

function parseId(value: string | string[] | undefined): number {
    const id = Number(value);
    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new AppError("Invalid ID.", 400);
    }
    return id;
}

function requireUser(req: Request) {
    if (!req.user) throw new AppError("No authentication.", 401);
    return req.user;
}

function requireRole(req: Request): CompanyRole {
    const role = req.user?.role;
    if (!role) throw new AppError("Missing company role.", 403);
    return role;
}

export async function getAvailability(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parsed = availabilityQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid availability query.",
                errors: parsed.error.flatten()
            });
        }
        const slots = await appointmentsService.getAvailability(
            parseId(req.params.companyId),
            parsed.data
        );
        return res.status(200).json(slots);
    } catch (error) {
        next(error);
    }
}

export async function requestAppointment(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = requireUser(req);
        const appointment = await appointmentsService.requestAppointment(
            parseId(req.params.companyId),
            user.id,
            req.body
        );
        return res.status(201).json(appointment);
    } catch (error) {
        next(error);
    }
}

export async function listCustomerAppointments(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const appointments = await appointmentsService.listCustomerAppointments(
            requireUser(req).id
        );
        return res.status(200).json(appointments);
    } catch (error) {
        next(error);
    }
}

export async function getCustomerAppointment(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const appointment = await appointmentsService.getCustomerAppointment(
            parseId(req.params.appointmentId),
            requireUser(req).id
        );
        return res.status(200).json(appointment);
    } catch (error) {
        next(error);
    }
}

export async function cancelCustomerAppointment(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const appointment = await appointmentsService.cancelCustomerAppointment(
            parseId(req.params.appointmentId),
            requireUser(req).id
        );
        return res.status(200).json(appointment);
    } catch (error) {
        next(error);
    }
}

export async function listCompanyAppointments(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parsed = listAppointmentsQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid appointment filters.",
                errors: parsed.error.flatten()
            });
        }
        const user = requireUser(req);
        const appointments = await appointmentsService.listCompanyAppointments(
            parseId(req.params.companyId),
            user.id,
            requireRole(req),
            parsed.data
        );
        return res.status(200).json(appointments);
    } catch (error) {
        next(error);
    }
}

export async function getCompanyAppointment(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = requireUser(req);
        const appointment = await appointmentsService.getCompanyAppointment(
            parseId(req.params.appointmentId),
            parseId(req.params.companyId),
            user.id,
            requireRole(req)
        );
        return res.status(200).json(appointment);
    } catch (error) {
        next(error);
    }
}

export function changeCompanyAppointmentStatus(action: TransitionAction) {
    return async function(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = requireUser(req);
            const appointment = await appointmentsService.changeCompanyAppointmentStatus(
                action,
                parseId(req.params.appointmentId),
                parseId(req.params.companyId),
                user.id,
                requireRole(req)
            );
            return res.status(200).json(appointment);
        } catch (error) {
            next(error);
        }
    };
}
