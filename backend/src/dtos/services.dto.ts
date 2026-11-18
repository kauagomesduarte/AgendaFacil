import { z } from "zod";

export const createServiceSchema = z.object({
    name: z.string().trim().min(1).max(150),
    price: z.number().finite().nonnegative(),
    durationMinutes: z.number().int().positive()
});

export const updateServiceSchema = z.object({
    name: z.string().trim().min(1).max(150).optional(),
    price: z.number().finite().nonnegative().optional(),
    durationMinutes: z.number().int().positive().optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided." }
);
