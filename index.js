import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import { apiLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import cartRoutes from "./routes/cart.js";
import differentPower from "./routes/differentPower.js";
import servicesRoutes from "./routes/services.js";

import { disconnectDB, connectDB } from "./config/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ======= MIDDLEWARES (ANTES das rotas e do listen) =======
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", apiLimiter);

// ======= ROTAS =======
app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", cartRoutes);
app.use("/api/appointments", differentPower);
app.use("/api/services", servicesRoutes);

app.get("/", (req, res) => {
    res.redirect("/login.html");
});

app.get("/dashboard.html", (req, res) => {
    res.redirect("/dashbord.html");
});

// ======= START SERVER (DEPOIS de tudo configurado) =======
const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        process.on("SIGINT", async () => {
            console.log("Recebido SIGINT...");
            server.close(async () => {
                await disconnectDB();
                process.exit(0);
            });
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();
