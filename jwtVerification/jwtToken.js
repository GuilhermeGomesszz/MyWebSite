import jwt from "jsonwebtoken";
 
const generateToken = (userId, role, res) => {
    const token = jwt.sign(
        {
            id: userId,
            role: role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
 
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
 
    return token;
};
 
export default generateToken;