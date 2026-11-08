import type { Request, Response, NextFunction } from "express";
import { validateJWT } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

export function validateToken(
    req: Request,
    res: Response,
    next: NextFunction
){
    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        next();
    } catch (error) {
        res.status(401).json({
            message: "Token inválido ou expirado."
        });
    }

}