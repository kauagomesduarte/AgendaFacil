import { z } from "zod";
import { AppointmentStatus } from "../../generated/prisma/enums.js";

const isoDateTime = z.string().refine(
    value => /(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
        Number.isFinite(Date.parse(value)),
    { message: "Expected an ISO date-time with a timezone offset." }
);

export const createAppointmentSchema = z.object({
    serviceId: z.number().int().positive(),
    employeeId: z.number().int().positive(),
    startAt: isoDateTime
});

export const availabilityQuerySchema = z.object({
    serviceId: z.coerce.number().int().positive(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    employeeId: z.coerce.number().int().positive().optional()
});

export const listAppointmentsQuerySchema = z.object({
    from: isoDateTime.optional(),
    to: isoDateTime.optional(),
    employeeId: z.coerce.number().int().positive().optional(),
    status: z.nativeEnum(AppointmentStatus).optional()
}).refine(data => {
    return data.from === undefined ||
        data.to === undefined ||
        Date.parse(data.from) < Date.parse(data.to);
}, {
    message: "'from' must be before 'to'.",
    path: ["to"]
});

export type CreateAppointmentDTO = z.infer<typeof createAppointmentSchema>;
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
export type ListAppointmentsQuery = z.infer<typeof listAppointmentsQuerySchema>;
