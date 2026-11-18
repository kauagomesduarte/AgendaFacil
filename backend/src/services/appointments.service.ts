import { AppointmentStatus, CompanyRole } from "../../generated/prisma/enums.js";
import * as appointmentRepository from "../repositories/appointment.repository.js";
import * as employeeRepository from "../repositories/employee.repository.js";
import { AppError } from "../utils/appError.js";
import {
    appointmentFitsSchedule,
    getLocalDateTime,
    localDateTimeToInstant
} from "../utils/scheduleTime.js";
import type {
    AvailabilityQuery,
    CreateAppointmentDTO,
    ListAppointmentsQuery
} from "../dtos/appointments.dto.js";

const slotStepMinutes = 15;

function nextLocalDate(date: string): string {
    const next = new Date(Date.parse(`${date}T00:00:00.000Z`) + 86_400_000);
    return next.toISOString().slice(0, 10);
}

export async function getAvailability(
    companyId: number,
    query: AvailabilityQuery
) {
    const { company, service, assignments } =
        await appointmentRepository.getAvailabilityData(
            companyId,
            query.serviceId,
            query.employeeId
        );
    const timeZone = company.timeZone;
    if (!timeZone) {
        throw new AppError("Company time zone must be configured before booking.", 409);
    }

    const dayStart = localDateTimeToInstant(query.date, 0, timeZone);
    if (!dayStart) {
        throw new AppError("Invalid local date for the company's time zone.", 400);
    }
    const dayEnd = localDateTimeToInstant(
        nextLocalDate(query.date),
        0,
        timeZone
    );
    const midDay = localDateTimeToInstant(query.date, 720, timeZone);
    if (!dayEnd || !midDay) {
        throw new AppError("Invalid local date for the company's time zone.", 400);
    }

    const weekday = getLocalDateTime(midDay, timeZone).weekday;
    const employeeIds = assignments.map(item => item.companyUserId);
    const appointments = await appointmentRepository.findOverlappingAppointments(
        employeeIds,
        dayStart,
        dayEnd
    );
    const now = new Date();
    const slots = [];

    for (const assignment of assignments) {
        for (const schedule of assignment.companyUser.schedules) {
            if (schedule.dayOfWeek !== weekday) continue;

            for (
                let startMinute = schedule.startMinute;
                startMinute + service.durationMinutes <= schedule.endMinute;
                startMinute += slotStepMinutes
            ) {
                const startAt = localDateTimeToInstant(
                    query.date,
                    startMinute,
                    timeZone
                );
                if (!startAt || startAt <= now) continue;

                const endAt = new Date(
                    startAt.getTime() + service.durationMinutes * 60_000
                );
                if (!appointmentFitsSchedule(
                    startAt,
                    endAt,
                    schedule,
                    timeZone
                )) {
                    continue;
                }

                const hasConflict = appointments.some(appointment =>
                    appointment.companyUserId === assignment.companyUserId &&
                    startAt < appointment.endAt &&
                    endAt > appointment.startAt
                );
                if (!hasConflict) {
                    slots.push({
                        employeeId: assignment.companyUserId,
                        startAt: startAt.toISOString(),
                        endAt: endAt.toISOString()
                    });
                }
            }
        }
    }

    return slots.sort((left, right) =>
        left.startAt.localeCompare(right.startAt) ||
        left.employeeId - right.employeeId
    );
}

export async function requestAppointment(
    companyId: number,
    customerUserId: number,
    data: CreateAppointmentDTO
) {
    const startAt = new Date(data.startAt);
    if (startAt <= new Date()) {
        throw new AppError("Appointment must start in the future.", 400);
    }
    if (startAt.getUTCSeconds() !== 0 || startAt.getUTCMilliseconds() !== 0) {
        throw new AppError("Appointment start must be on a whole minute.", 400);
    }

    return appointmentRepository.createAppointment(
        companyId,
        data.employeeId,
        data.serviceId,
        customerUserId,
        startAt
    );
}

export async function listCustomerAppointments(customerUserId: number) {
    return appointmentRepository.findCustomerAppointments(customerUserId);
}

export async function getCustomerAppointment(
    appointmentId: number,
    customerUserId: number
) {
    const appointment = await appointmentRepository.findAppointment(appointmentId);
    if (!appointment || appointment.customerUserId !== customerUserId) {
        throw new AppError("Appointment not found.", 404);
    }
    return appointment;
}

export async function listCompanyAppointments(
    companyId: number,
    userId: number,
    role: CompanyRole,
    filters: ListAppointmentsQuery
) {
    let employeeId = filters.employeeId;
    if (role === CompanyRole.EMPLOYEE) {
        const employee = await employeeRepository.findEmployee(userId, companyId);
        if (!employee) throw new AppError("Employee not found.", 404);
        if (employeeId !== undefined && employeeId !== employee.id) {
            throw new AppError("Employees may only view their own appointments.", 403);
        }
        employeeId = employee.id;
    }

    const repositoryFilters: {
        from?: Date;
        to?: Date;
        employeeId?: number;
        status?: AppointmentStatus;
    } = {};
    if (filters.from) repositoryFilters.from = new Date(filters.from);
    if (filters.to) repositoryFilters.to = new Date(filters.to);
    if (employeeId !== undefined) repositoryFilters.employeeId = employeeId;
    if (filters.status !== undefined) repositoryFilters.status = filters.status;

    return appointmentRepository.findCompanyAppointments(
        companyId,
        repositoryFilters
    );
}

export async function getCompanyAppointment(
    appointmentId: number,
    companyId: number,
    userId: number,
    role: CompanyRole
) {
    const appointment = await appointmentRepository.findAppointment(appointmentId);
    if (
        !appointment ||
        appointment.employeeService.companyUser.companyId !== companyId
    ) {
        throw new AppError("Appointment not found.", 404);
    }
    if (
        role === CompanyRole.EMPLOYEE &&
        appointment.employeeService.companyUser.userId !== userId
    ) {
        throw new AppError("Appointment not found.", 404);
    }
    return appointment;
}

type TransitionAction = "confirm" | "reject" | "cancel" | "complete" | "no-show";

function transitionFor(action: TransitionAction) {
    switch (action) {
        case "confirm":
            return {
                allowed: [AppointmentStatus.PENDING],
                next: AppointmentStatus.CONFIRMED
            };
        case "reject":
            return {
                allowed: [AppointmentStatus.PENDING],
                next: AppointmentStatus.REJECTED
            };
        case "cancel":
            return {
                allowed: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
                next: AppointmentStatus.CANCELLED
            };
        case "complete":
            return {
                allowed: [AppointmentStatus.CONFIRMED],
                next: AppointmentStatus.COMPLETED
            };
        case "no-show":
            return {
                allowed: [AppointmentStatus.CONFIRMED],
                next: AppointmentStatus.NO_SHOW
            };
    }
}

export async function changeCompanyAppointmentStatus(
    action: TransitionAction,
    appointmentId: number,
    companyId: number,
    userId: number,
    role: CompanyRole
) {
    const appointment = await getCompanyAppointment(
        appointmentId,
        companyId,
        userId,
        role
    );
    const now = new Date();

    if (
        (action === "confirm" || action === "reject" || action === "cancel") &&
        appointment.startAt <= now
    ) {
        throw new AppError("This appointment can no longer be changed before its start.", 409);
    }
    if (
        (action === "complete" || action === "no-show") &&
        appointment.endAt > now
    ) {
        throw new AppError("Appointment can be completed only after its scheduled end.", 409);
    }

    const transition = transitionFor(action);
    const timing = action === "complete" || action === "no-show"
        ? "afterEnd"
        : "beforeStart";
    return appointmentRepository.changeAppointmentStatus(
        appointmentId,
        transition.allowed,
        transition.next,
        timing
    );
}

export async function cancelCustomerAppointment(
    appointmentId: number,
    customerUserId: number
) {
    const appointment = await getCustomerAppointment(
        appointmentId,
        customerUserId
    );
    if (appointment.startAt <= new Date()) {
        throw new AppError("Appointment can no longer be cancelled after it starts.", 409);
    }
    return appointmentRepository.changeAppointmentStatus(
        appointmentId,
        [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        AppointmentStatus.CANCELLED,
        "beforeStart"
    );
}
