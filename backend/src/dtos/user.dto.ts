import z from 'zod';

export interface UserDTO{
    id: number
    password: string;
    name: string | null;
    email: string
}


export const createUserSchema = z.object({
    name: z.string().min(3),
    password: z.string().min(8),
    email: z.email()
})

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    name: z.string().min(3).optional(),
    password: z.string().min(8).optional(),
    email: z.email().optional()
})

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;