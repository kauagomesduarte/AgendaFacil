import { CompanyRole } from "../../generated/prisma/enums.js";
import * as employeeRepository from "../repositories/employee.repository.js";
import * as schedulesRepository from "../repositories/schedules.repository.js";
import { AppError } from "../utils/appError.js";
import type { CreateScheduleDTO, UpdateScheduleDTO } from "../dtos/schedules.dto.js";

export async function getSchedules(
    companyUserId: number,
    companyId: number,
    requestUserId: number,
    requestRole: CompanyRole
) {
    const employee = await employeeRepository.findEmployeeById(companyUserId);
    if (!employee || employee.companyId !== companyId) {
        throw new AppError("Employee not found.", 404);
    }
    if (requestRole === CompanyRole.EMPLOYEE && employee.userId !== requestUserId) {
        throw new AppError("You may only view your own schedule.", 403);
    }
    return schedulesRepository.findSchedules(companyUserId, companyId);
}

export async function createSchedule(
    companyUserId: number,
    companyId: number,
    data: CreateScheduleDTO
) {
    return schedulesRepository.createSchedule(companyUserId, companyId, data);
}

export async function updateSchedule(
    scheduleId: number,
    companyUserId: number,
    companyId: number,
    data: UpdateScheduleDTO
) {
    return schedulesRepository.updateSchedule(
        scheduleId,
        companyUserId,
        companyId,
        data
    );
}

export async function deleteSchedule(
    scheduleId: number,
    companyUserId: number,
    companyId: number
) {
    return schedulesRepository.deleteSchedule(
        scheduleId,
        companyUserId,
        companyId
    );
}
