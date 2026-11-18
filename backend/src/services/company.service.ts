import {Prisma} from "../../generated/prisma/client.js";
import type { companyDTO, createCompanyDTO, updateCompanyDTO } from "../dtos/company.dto.js";
import * as companyRepository from "../repositories/company.repository.js"; 
import * as userRepository from "../repositories/user.repository.js";
import { AppError } from "../utils/appError.js";

export async function createCompany(data: createCompanyDTO, userId: number): Promise<companyDTO>{
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("Request user not found", 404);

    try {
        return await companyRepository.createCompany(data, userId)
    }
    catch (error) {
        throw error;
    }
}

export async function findCompanybyId(companyId: number): Promise<companyDTO>{
    const company = await companyRepository.findCompanybyId(companyId);

    if (!company) throw new AppError("Company not found", 404);

    return company;
}

export async function findCompanies(){
    try {
        return await companyRepository.findCompanies();
    } catch (error) {
        throw error;
    }
}

export async function updateCompany(companyId: number, data: updateCompanyDTO): Promise<companyDTO>{
    try {
        return await companyRepository.updateCompany(companyId, data);

    } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            throw new AppError("Company not found", 404);
        }
        throw error;
    }
}

export async function deleteCompany(companyId: number){
    try {
       return await companyRepository.deleteCompany(companyId)

    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            throw new AppError("Company not found", 404);
        }
        throw error;
    }
}