import { z } from "zod";

const dayOfWeek = z.number().int().min(1).max(7);
const startMinute = z.number().int().min(0).max(1439);
const endMinute = z.number().int().min(1).max(1440);

export const createScheduleSchema = z.object({
    dayOfWeek,
    startMinute,
    endMinute
}).refine(data => data.startMinute < data.endMinute, {
    message: "Schedule start must be before its end.",
    path: ["endMinute"]
});

export const updateScheduleSchema = z.object({
    dayOfWeek: dayOfWeek.optional(),
    startMinute: startMinute.optional(),
    endMinute: endMinute.optional()
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided."
}).refine(data => {
    return data.startMinute === undefined ||
        data.endMinute === undefined ||
        data.startMinute < data.endMinute;
}, {
    message: "Schedule start must be before its end.",
    path: ["endMinute"]
});

export type CreateScheduleDTO = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleDTO = z.infer<typeof updateScheduleSchema>;
