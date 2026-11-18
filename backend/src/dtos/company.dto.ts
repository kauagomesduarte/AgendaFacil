import z from 'zod';
import { isValidIanaTimeZone } from "../utils/scheduleTime.js";

const timeZoneSchema = z.string().trim().min(1).max(64).refine(
    isValidIanaTimeZone,
    { message: "timeZone must be a valid IANA time zone." }
);

export const companySchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(3).max(150),
    timeZone: timeZoneSchema.nullable()
});

export type companyDTO = z.infer<typeof companySchema>;

export const createCompanySchema = z.object({
    name: z.string().trim().min(3).max(150),
    timeZone: timeZoneSchema
})

export type createCompanyDTO = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = z.object({
    name: z.string().trim().min(3).max(150).optional(),
    timeZone: timeZoneSchema.optional()
})

export type updateCompanyDTO = z.infer<typeof updateCompanySchema>;