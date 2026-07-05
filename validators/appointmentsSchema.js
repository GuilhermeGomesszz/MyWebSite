import { z } from "zod";

export const appointmentSchema = z.object({
    barberId: z.number(),
    serviceId: z.number(),
    scheduledAt: z.string().datetime(),
    notes: z.string().optional()
});