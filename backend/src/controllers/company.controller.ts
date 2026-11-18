import type{Request, Response} from 'express';
import * as companyService from "../services/company.service.js";
import type { companyDTO, createCompanyDTO, updateCompanyDTO } from '../dtos/company.dto.js';
import type { Company } from '../../generated/prisma/client.js';
import { AppError } from '../utils/appError.js';

function parseId(value: string | string[] | undefined): number {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new AppError("Invalid ID.", 400);
    }

    return id;
}

export async function createCompany(req: Request, res: Response){
    const userId = req.user?.id;
    if (userId === undefined) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const data: createCompanyDTO = req.body;
    const company: companyDTO = await companyService.createCompany(data, userId)
    return res.status(201).json(company)
}

export async function findCompanybyId(req: Request, res: Response){
    const companyId: number = parseId(req.params.id);
    if (companyId === undefined) {return res.status(400).json({message: "Invalid id"})}

    const company = await companyService.findCompanybyId(companyId);
    return res.status(200).json(company);
}

export async function findCompanies(req: Request, res: Response){
    const companies: Company[] = await companyService.findCompanies();

    return res.status(200).json(companies);
}

export async function updateCompany(req: Request, res: Response){
    const companyId: number = parseId(req.params.id);
    if (companyId === undefined) return res.status(400).json({message: "Invalid id"});
    
    const data: updateCompanyDTO = req.body;
    const updatedCompany: companyDTO = await companyService.updateCompany(companyId, data);
    return res.status(200).json(updatedCompany);
}

export async function deleteCompany(req: Request, res: Response){
    const companyId: number =  parseId(req.params.id);
     if (companyId === undefined) return res.status(400).json({message: "Invalid id"});

    await companyService.deleteCompany(companyId);
    return res.status(204).send();
}