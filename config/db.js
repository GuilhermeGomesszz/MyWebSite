import dotenv from 'dotenv';
import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

dotenv.config();

const { PrismaClient } = pkg;

const getDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const databaseUrl = new URL(process.env.DATABASE_URL);
  const sslMode = databaseUrl.searchParams.get("sslmode");

  if (["prefer", "require", "verify-ca"].includes(sslMode)) {
    databaseUrl.searchParams.set("sslmode", "verify-full");
  }

  return databaseUrl.toString();
};

const pool = new Pool({
        connectionString: getDatabaseUrl()
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient(
    {
        adapter,
        log:
            process.env.NODE_ENV === "development"
            ?["query", "error", "warn"]
            : ["error"]
    }
);

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("Erro ao desconectar do banco de dados:", error);
  }
};

export  { prisma, connectDB, disconnectDB };

export default prisma;
