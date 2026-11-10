import z from 'zod';

const authSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export type authDTO = z.infer<typeof authSchema>;