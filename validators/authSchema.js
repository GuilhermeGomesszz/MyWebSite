import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    role: z.enum(["ADMIN", "BARBER", "CLIENT"]),
    phone: z.string().optional().nullable(), // Aceita string, vazio ou nulo
    specialties: z.array(z.string()).optional() // Aceita a lista de especialidades enviada pelo HTML
});