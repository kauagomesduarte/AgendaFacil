import {prisma} from "../libs/prisma.js";
import {Prisma} from "../../generated/prisma/client.js"
import type { Company } from "../../generated/prisma/client.js";
import { AppError } from "../utils/appError.js";
import type { CompanyCreateInput } from "../../generated/prisma/models.js";
import { hasActiveFutureAppointments, hasAnyAppointments } from "./appointment.repository.js";
import { lockCompany } from "./transactionLocks.js";
import type { updateCompanyDTO } from "../dtos/company.dto.js";

export async function createCompany(data: CompanyCreateInput, userId: number): Promise<Company> {
    return await prisma.$transaction(async (tx) => {
        const company: Company = await tx.company.create({
            data
        });

        await tx.companyUser.create({
            data: {
                userId,
                companyId: company.id,
                role: "OWNER"
            }
        });
    
        return company;
    });
}

export async function findCompanybyId(companyId: number): Promise<Company | null>{
    const company: Company | null = await prisma.company.findUnique({
        where: {
            id: companyId
        }
    });

    return company;
}

export async function findCompanies(){
    return prisma.company.findMany();
}

export async function updateCompany(companyId: number, data: updateCompanyDTO): Promise<Company>{
    return prisma.$transaction(async tx => {
        await lockCompany(tx, companyId, "UPDATE");
        const company = await tx.company.findUnique({
            where: { id: companyId }
        });
        if (!company) throw new AppError("Company not found.", 404);

        if (
            data.timeZone !== undefined &&
            data.timeZone !== company.timeZone
        ) {
            const scheduleCount = await tx.schedule.count({
                where: { companyUser: { companyId } }
            });
            const appointmentCount = await tx.appointment.count({
                where: {
                    employeeService: {
                        is: {
                            companyUser: {
                                is: { companyId }
                            }
                        }
                    }
                }
            });
            if (
                appointmentCount > 0 ||
                (company.timeZone !== null && scheduleCount > 0)
            ) {
                throw new AppError(
                    "Company time zone cannot change after schedules or appointments exist.",
                    409
                );
            }
        }

        const updateData: Prisma.CompanyUpdateInput = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.timeZone !== undefined) updateData.timeZone = data.timeZone;

        return tx.company.update({
            where: { id: companyId },
            data: updateData
        });
    });
}

export async function deleteCompany(companyId: number){
    return prisma.$transaction(async tx => {
        await lockCompany(tx, companyId, "UPDATE");
        const company = await tx.company.findUnique({
            where: { id: companyId },
            select: { id: true }
        });
        if (!company) throw new AppError("Company not found.", 404);

        const now = new Date();
        if (await hasActiveFutureAppointments(tx, { companyId }, now)) {
            throw new AppError(
                "Company has future appointments that must be resolved first.",
                409
            );
        }
        if (await hasAnyAppointments(tx, { companyId })) {
            throw new AppError(
                "Company cannot be deleted while appointment history exists.",
                409
            );
        }

        return tx.company.delete({ where: { id: companyId } });
    });
}