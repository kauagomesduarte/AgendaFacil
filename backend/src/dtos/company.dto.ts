import z from 'zod';


const companySchema = z.object({
    name: z.string().min(3)
})

export type companyDTO = z.infer<typeof companySchema>;

export const createCompanySchema = z.object({
    name: z.string().min(3)
})

export type createCompanyDTO = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = z.object({
    name: z.string().min(3).optional()
})

export type updateCompanyDTO = z.infer<typeof updateCompanySchema>;