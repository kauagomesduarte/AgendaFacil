import { AppointmentStatus, Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../libs/prisma.js";
import { AppError } from "../utils/appError.js";
import {
    appointmentFitsSchedule,
    getLocalDateTime,
    isValidIanaTimeZone
} from "../utils/scheduleTime.js";
import { isConstraintViolation } from "../utils/prismaErrors.js";
import { lockCompany, lockCompanyUser, lockService } from "./transactionLocks.js";

const activeStatuses = [
    AppointmentStatus.PENDING,
    AppointmentStatus.CONFIRMED
];

export interface AppointmentScope {
    companyUserId?: number;
    serviceId?: number;
    companyId?: number;
}

function scopeWhere(scope: AppointmentScope): Prisma.AppointmentWhereInput {
    const where: Prisma.AppointmentWhereInput = {};

    if (scope.companyUserId !== undefined) {
        where.companyUserId = scope.companyUserId;
    }
    if (scope.serviceId !== undefined) {
        where.serviceId = scope.serviceId;
    }
    if (scope.companyId !== undefined) {
        where.employeeService = {
            is: {
                companyUser: {
                    is: { companyId: scope.companyId }
                }
            }
        };
    }

    return where;
}

export async function hasActiveFutureAppointments(
    tx: Prisma.TransactionClient,
    scope: AppointmentScope,
    now: Date
): Promise<boolean> {
    return (await tx.appointment.count({
        where: {
            ...scopeWhere(scope),
            status: { in: activeStatuses },
            endAt: { gt: now }
        }
    })) > 0;
}

export async function hasAnyAppointments(
    tx: Prisma.TransactionClient,
    scope: AppointmentScope
): Promise<boolean> {
    return (await tx.appointment.count({
        where: scopeWhere(scope)
    })) > 0;
}

export async function getAvailabilityData(
    companyId: number,
    serviceId: number,
    employeeId: number | undefined
) {
    const [company, service, assignments] = await Promise.all([
        prisma.company.findUnique({
            where: { id: companyId },
            select: { id: true, name: true, timeZone: true }
        }),
        prisma.service.findFirst({
            where: { id: serviceId, companyId },
            select: { id: true, name: true, durationMinutes: true }
        }),
        prisma.employeeService.findMany({
            where: {
                serviceId,
                service: { companyId },
                companyUser: {
                    companyId,
                    ...(employeeId === undefined ? {} : { id: employeeId })
                }
            },
            include: {
                companyUser: {
                    include: {
                        user: { select: { id: true, name: true } },
                        schedules: {
                            orderBy: [{ dayOfWeek: "asc" }, { startMinute: "asc" }]
                        }
                    }
                }
            }
        })
    ]);

    if (!company) throw new AppError("Company not found.", 404);
    if (!company.timeZone) {
        throw new AppError("Company time zone must be configured before booking.", 409);
    }
    const timeZone = company.timeZone;
    if (!isValidIanaTimeZone(timeZone)) {
        throw new AppError("Company has an invalid IANA time zone.", 409);
    }
    if (!service) throw new AppError("Service not found.", 404);
    if (
        employeeId !== undefined &&
        !assignments.some(item => item.companyUserId === employeeId)
    ) {
        const employee = await prisma.companyUser.findFirst({
            where: { id: employeeId, companyId },
            select: { id: true }
        });
        if (!employee) throw new AppError("Employee not found.", 404);
    }

    return { company, service, assignments };
}

export async function findOverlappingAppointments(
    employeeIds: number[],
    rangeStart: Date,
    rangeEnd: Date
) {
    return employeeIds.length === 0
        ? []
        : prisma.appointment.findMany({
            where: {
                companyUserId: { in: employeeIds },
                status: { in: activeStatuses },
                startAt: { lt: rangeEnd },
                endAt: { gt: rangeStart }
            },
            select: { companyUserId: true, startAt: true, endAt: true }
        });
}

export async function createAppointment(
    companyId: number,
    employeeId: number,
    serviceId: number,
    customerUserId: number,
    startAt: Date
) {
    try {
        return await prisma.$transaction(async tx => {
            await lockCompany(tx, companyId, "SHARE");
            await lockService(tx, serviceId, "SHARE");
            await lockCompanyUser(tx, employeeId, "SHARE");

            const company = await tx.company.findUnique({
                where: { id: companyId },
                select: { id: true, name: true, timeZone: true }
            });
            const service = await tx.service.findFirst({
                where: { id: serviceId, companyId }
            });
            const assignment = await tx.employeeService.findUnique({
                where: {
                    companyUserId_serviceId: {
                        companyUserId: employeeId,
                        serviceId
                    }
                },
                include: {
                    companyUser: {
                        include: { user: { select: { id: true, name: true } } }
                    }
                }
            });
            const customer = await tx.user.findUnique({
                where: { id: customerUserId },
                select: { id: true, email: true, name: true }
            });

            if (!company) throw new AppError("Company not found.", 404);
            if (!company.timeZone) {
                throw new AppError("Company time zone must be configured before booking.", 409);
            }
            const timeZone = company.timeZone;
            if (!isValidIanaTimeZone(timeZone)) {
                throw new AppError("Company has an invalid IANA time zone.", 409);
            }
            if (!service) throw new AppError("Service not found.", 404);
            if (!assignment || assignment.companyUser.companyId !== companyId) {
                throw new AppError("Employee is not assigned to this service.", 409);
            }
            if (!customer) throw new AppError("Customer not found.", 404);
            if (startAt <= new Date()) {
                throw new AppError("Appointment must start in the future.", 400);
            }
            if (
                startAt.getUTCSeconds() !== 0 ||
                startAt.getUTCMilliseconds() !== 0
            ) {
                throw new AppError("Appointment start must be on a whole minute.", 400);
            }

            const endAt = new Date(startAt.getTime() + service.durationMinutes * 60_000);
            const localStart = getLocalDateTime(startAt, timeZone);
            const schedules = await tx.schedule.findMany({
                where: {
                    companyUserId: employeeId,
                    dayOfWeek: localStart.weekday
                }
            });

            if (!schedules.some(schedule =>
                appointmentFitsSchedule(startAt, endAt, schedule, timeZone)
            )) {
                throw new AppError("Appointment is outside the employee's schedule.", 409);
            }

            return tx.appointment.create({
                data: {
                    companyUserId: employeeId,
                    serviceId,
                    customerUserId,
                    startAt,
                    endAt,
                    companyNameAtBooking: company.name,
                    employeeNameAtBooking: assignment.companyUser.user.name,
                    serviceNameAtBooking: service.name,
                    customerNameAtBooking: customer.name ?? customer.email,
                    customerEmailAtBooking: customer.email,
                    priceAtBooking: service.price,
                    durationMinutesAtBooking: service.durationMinutes
                },
                include: {
                    employeeService: {
                        include: {
                            companyUser: { include: { user: true } },
                            service: true
                        }
                    }
                }
            });
        });
    } catch (error) {
        if (isConstraintViolation(error)) {
            throw new AppError("Appointment conflicts with an existing booking.", 409);
        }
        throw error;
    }
}

export async function findCustomerAppointments(customerUserId: number) {
    return prisma.appointment.findMany({
        where: { customerUserId },
        orderBy: { startAt: "asc" }
    });
}

export async function findAppointment(appointmentId: number) {
    return prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            customer: { select: { id: true, name: true, email: true } },
            employeeService: {
                include: {
                    companyUser: {
                        include: {
                            user: { select: { id: true, name: true } },
                            company: true
                        }
                    },
                    service: true
                }
            }
        }
    });
}

export async function findCompanyAppointments(
    companyId: number,
    filters: {
        from?: Date;
        to?: Date;
        employeeId?: number;
        status?: AppointmentStatus;
    }
) {
    return prisma.appointment.findMany({
        where: {
            employeeService: {
                is: {
                    companyUser: {
                        is: {
                            companyId,
                            ...(filters.employeeId === undefined
                                ? {}
                                : { id: filters.employeeId })
                        }
                    }
                }
            },
            ...(filters.to ? { startAt: { lt: filters.to } } : {}),
            ...(filters.from ? { endAt: { gt: filters.from } } : {}),
            ...(filters.status ? { status: filters.status } : {})
        },
        include: {
            customer: { select: { id: true, name: true, email: true } },
            employeeService: {
                include: {
                    companyUser: {
                        include: {
                            user: { select: { id: true, name: true } }
                        }
                    },
                    service: true
                }
            }
        },
        orderBy: { startAt: "asc" }
    });
}

export async function changeAppointmentStatus(
    appointmentId: number,
    allowedStatuses: AppointmentStatus[],
    nextStatus: AppointmentStatus,
    timing?: "beforeStart" | "afterEnd"
) {
    return prisma.$transaction(async tx => {
        await tx.$queryRaw`SELECT "id" FROM "appointments" WHERE "id" = ${appointmentId} FOR UPDATE`;
        const appointment = await tx.appointment.findUnique({
            where: { id: appointmentId }
        });
        if (!appointment) throw new AppError("Appointment not found.", 404);
        if (!allowedStatuses.includes(appointment.status)) {
            throw new AppError("Appointment status has already changed.", 409);
        }

        const now = new Date();
        if (timing === "beforeStart" && appointment.startAt <= now) {
            throw new AppError("Appointment can no longer be changed before its start.", 409);
        }
        if (timing === "afterEnd" && appointment.endAt > now) {
            throw new AppError("Appointment can only be completed after its scheduled end.", 409);
        }

        const result = await tx.appointment.updateMany({
            where: {
                id: appointmentId,
                status: { in: allowedStatuses }
            },
            data: { status: nextStatus }
        });
        if (result.count === 0) {
            throw new AppError("Appointment status has already changed.", 409);
        }

        return tx.appointment.findUnique({
            where: { id: appointmentId }
        });
    });
}
