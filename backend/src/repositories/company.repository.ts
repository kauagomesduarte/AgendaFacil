import {prisma} from "../libs/prisma.js";
import {Prisma} from "../../generated/prisma/client.js"
import type { Company } from "../../generated/prisma/client.js";
import type { User } from "../../generated/prisma/browser.js";
import { AppError } from "../utils/appError.js";
import type { CompanyAggregateArgs, CompanyCreateInput } from "../../generated/prisma/models.js";

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

export async function updateCompany(companyId: number, data: Omit<Company, "id">): Promise<Company>{
    return await prisma.company.update({
        where: { id: companyId }, data
    });
}

export async function deleteCompany(companyId: number){
    return await prisma.company.delete({
        where: { id: companyId }
    })
}