import z from 'zod';

export const authSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export type authDTO = z.infer<typeof authSchema>;

export interface AuthMeCompanyDTO {
    companyUserId: number;
    companyId: number;
    companyName: string;
    role: "OWNER" | "MANAGER" | "EMPLOYEE";
}

export interface AuthMeDTO {
    id: number;
    name: string | null;
    email: string;
    companies: AuthMeCompanyDTO[];
}