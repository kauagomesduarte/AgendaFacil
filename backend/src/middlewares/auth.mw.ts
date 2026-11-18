import type { Request, Response, NextFunction } from "express";
import { validateJWT } from "../utils/jwt.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { authDTO } from "../dtos/auth.dto.js";
import { AppError } from "../utils/appError.js";
import { authSchema } from "../dtos/auth.dto.js";

export function validateToken(
    req: Request,
    res: Response,
    next: NextFunction
){
    const token = req.cookies?.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        req.user = {
            id: decoded.id,
            email: decoded.email
        }

        next();
    } catch (error) {
        console.error('validateToken error:', error);
        return next(new AppError("Unauthorized", 401));
    }

}

export function validateLogin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = authSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Dados inválidos",
            errors: result.error.flatten()
        });
    }

    req.body = result.data;
    next();
}