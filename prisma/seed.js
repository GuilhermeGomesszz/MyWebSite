import dotenv from "dotenv";
import { prisma } from "../config/db.js";

dotenv.config();

async function main() {
  // Limpa os dados
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();

  // ===== SERVIÇOS =====
  await prisma.service.createMany({
    data: [
      {
        name: "Corte Clássico",
        description: "Corte tradicional",
        durationMinutes: 45,
        priceInCents: 4500,
      },
      {
        name: "Barba",
        description: "Modelagem completa da barba",
        durationMinutes: 30,
        priceInCents: 3000,
      },
      {
        name: "Corte + Barba",
        description: "Pacote completo",
        durationMinutes: 70,
        priceInCents: 7000,
      },
      {
        name: "Sobrancelha",
        description: "Design de sobrancelha",
        durationMinutes: 15,
        priceInCents: 1500,
      },
      {
        name: "Pigmentação da Barba",
        description: "Pigmentação natural",
        durationMinutes: 40,
        priceInCents: 4000,
      },
      {
        name: "Hidratação Capilar",
        description: "Tratamento hidratante",
        durationMinutes: 35,
        priceInCents: 3500,
      },
      {
        name: "Lavagem Capilar",
        description: "Lavagem e finalização",
        durationMinutes: 20,
        priceInCents: 2000,
      },
      {
        name: "Corte Infantil",
        description: "Corte para crianças",
        durationMinutes: 40,
        priceInCents: 3500,
      },
      {
        name: "Pezinho",
        description: "Acabamento do corte",
        durationMinutes: 15,
        priceInCents: 1000,
      },
      {
        name: "Progressiva Masculina",
        description: "Alinhamento e redução de volume",
        durationMinutes: 90,
        priceInCents: 12000,
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Serviços cadastrados com sucesso!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });