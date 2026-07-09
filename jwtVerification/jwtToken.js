import jwt from "jsonwebtoken";

const getJwtSecret = () => {
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) {
        return process.env.JWT_SECRET.trim();
    }

    if (process.env.NODE_ENV === "production") {
        console.warn("JWT_SECRET não configurado. Usando segredo temporário para evitar falha de autenticação.");
    }

    return "barber-shop-dev-secret-change-me";
};

const getJwtExpiresIn = () => {
    const rawValue = process.env.JWT_EXPIRES_IN;

    if (!rawValue || !rawValue.trim()) {
        return "7d";
    }

    const normalizedValue = rawValue.trim().replace(/^['"]|['"]$/g, "");

    if (/^\d+$/.test(normalizedValue)) {
        return Number(normalizedValue);
    }

    return normalizedValue;
};
 
const generateToken = (userId, role, res) => {
    const token = jwt.sign(
        {
            id: userId,
            role: role
        },
        getJwtSecret(),
        {
            expiresIn: getJwtExpiresIn()
        }
    );
 
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
 
    return token;
};
 
export default generateToken;