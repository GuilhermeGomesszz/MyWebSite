import { z } from "zod";

export const serviceSchema = z.object({
    name: z.string().min(2, "Nome obrigatório"),
    description: z.string().optional(),
    durationMinutes: z.number().int().positive(),
    priceInCents: z.number().int().positive()
});