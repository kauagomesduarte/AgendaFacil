import { AppointmentStatus, Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../libs/prisma.js";
import { AppError } from "../utils/appError.js";
import { appointmentFitsSchedule } from "../utils/scheduleTime.js";
import { isConstraintViolation } from "../utils/prismaErrors.js";
import { lockCompany, lockCompanyUser } from "./transactionLocks.js";
import type { CreateScheduleDTO, UpdateScheduleDTO } from "../dtos/schedules.dto.js";

async function ensureAppointmentsFit(
    tx: Prisma.TransactionClient,
    companyUserId: number,
    companyId: number,
    schedules: Array<{ dayOfWeek: number; startMinute: number; endMinute: number }>
) {
    const company = await tx.company.findUnique({
        where: { id: companyId },
        select: { timeZone: true }
    });
    const now = new Date();
    const appointments = await tx.appointment.findMany({
        where: {
            companyUserId,
            status: {
                in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]
            },
            endAt: { gt: now }
        },
        select: { startAt: true, endAt: true }
    });

    if (appointments.length === 0) return;
    const timeZone = company?.timeZone;
    if (!timeZone) {
        throw new AppError("Cannot change schedule while appointments exist and the company time zone is missing.", 409);
    }

    for (const appointment of appointments) {
        const fits = schedules.some(schedule =>
            appointmentFitsSchedule(
                appointment.startAt,
                appointment.endAt,
                schedule,
                timeZone
            )
        );
        if (!fits) {
            throw new AppError("Schedule change would invalidate an existing appointment.", 409);
        }
    }
}

export async function findSchedules(companyUserId: number, companyId: number) {
    return prisma.schedule.findMany({
        where: {
            companyUserId,
            companyUser: { companyId }
        },
        orderBy: [{ dayOfWeek: "asc" }, { startMinute: "asc" }]
    });
}

export async function createSchedule(
    companyUserId: number,
    companyId: number,
    data: CreateScheduleDTO
) {
    try {
        return await prisma.$transaction(async tx => {
            await lockCompany(tx, companyId, "SHARE");
            await lockCompanyUser(tx, companyUserId, "UPDATE");
            const employee = await tx.companyUser.findFirst({
                where: { id: companyUserId, companyId }
            });
            if (!employee) throw new AppError("Employee not found.", 404);

            return tx.schedule.create({
                data: { companyUserId, ...data }
            });
        });
    } catch (error) {
        if (isConstraintViolation(error)) {
            throw new AppError("Schedule intervals cannot overlap.", 409);
        }
        throw error;
    }
}

export async function updateSchedule(
    scheduleId: number,
    companyUserId: number,
    companyId: number,
    data: UpdateScheduleDTO
) {
    try {
        return await prisma.$transaction(async tx => {
            await lockCompany(tx, companyId, "SHARE");
            await lockCompanyUser(tx, companyUserId, "UPDATE");
            const schedule = await tx.schedule.findFirst({
                where: {
                    id: scheduleId,
                    companyUserId,
                    companyUser: { companyId }
                }
            });
            if (!schedule) throw new AppError("Schedule not found.", 404);

            const schedules = await tx.schedule.findMany({
                where: { companyUserId }
            });
            const updatedStart = data.startMinute ?? schedule.startMinute;
            const updatedEnd = data.endMinute ?? schedule.endMinute;
            if (updatedStart >= updatedEnd) {
                throw new AppError("Schedule start must be before its end.", 400);
            }
            const resultingSchedules = schedules.map(item => ({
                dayOfWeek: item.id === scheduleId
                    ? data.dayOfWeek ?? item.dayOfWeek
                    : item.dayOfWeek,
                startMinute: item.id === scheduleId
                    ? data.startMinute ?? item.startMinute
                    : item.startMinute,
                endMinute: item.id === scheduleId
                    ? data.endMinute ?? item.endMinute
                    : item.endMinute
            }));
            await ensureAppointmentsFit(
                tx,
                companyUserId,
                companyId,
                resultingSchedules
            );

            const updateData: Prisma.ScheduleUpdateInput = {};
            if (data.dayOfWeek !== undefined) updateData.dayOfWeek = data.dayOfWeek;
            if (data.startMinute !== undefined) updateData.startMinute = data.startMinute;
            if (data.endMinute !== undefined) updateData.endMinute = data.endMinute;

            return tx.schedule.update({
                where: { id: scheduleId },
                data: updateData
            });
        });
    } catch (error) {
        if (isConstraintViolation(error)) {
            throw new AppError("Schedule intervals cannot overlap.", 409);
        }
        throw error;
    }
}

export async function deleteSchedule(
    scheduleId: number,
    companyUserId: number,
    companyId: number
) {
    return prisma.$transaction(async tx => {
        await lockCompany(tx, companyId, "SHARE");
        await lockCompanyUser(tx, companyUserId, "UPDATE");
        const schedule = await tx.schedule.findFirst({
            where: {
                id: scheduleId,
                companyUserId,
                companyUser: { companyId }
            }
        });
        if (!schedule) throw new AppError("Schedule not found.", 404);

        const remainingSchedules = await tx.schedule.findMany({
            where: { companyUserId, id: { not: scheduleId } }
        });
        await ensureAppointmentsFit(
            tx,
            companyUserId,
            companyId,
            remainingSchedules
        );

        await tx.schedule.delete({ where: { id: scheduleId } });
    });
}
