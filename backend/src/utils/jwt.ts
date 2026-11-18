import jwt from "jsonwebtoken";
import { AppError } from "./appError.js";

const secret = process.env.JWT_SECRET!;
const expiresIn = process.env.JWT_EXPIRES_IN;

export function createJWT(payload: jwt.JwtPayload): string{
    if (!secret) throw new AppError("JWT_SECRET missing.", 500);
    if (!expiresIn) throw new AppError("JWT_EXPIRES_IN missing.", 500);

    const token = jwt.sign(
        payload,
        secret,
        {expiresIn: expiresIn as NonNullable<jwt.SignOptions["expiresIn"]>}
    )
    return token;
}

export function validateJWT(token: string){
    return jwt.verify(token, secret);
}