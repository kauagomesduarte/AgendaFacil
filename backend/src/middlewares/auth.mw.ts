import type { Request, Response, NextFunction } from "express";
import { validateJWT } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import type { authDTO } from "../dtos/auth.dto.js";

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

export function validateLogin(
    req: Request,
    res: Response,
    next: NextFunction
){

    const { email, password } = req.body;

    if(!email || !password) {
        res.status(400).json({message: "Dados inválidos"});
    }

    const data: authDTO = {
        email,
        password
    }

    req.body = data;

    next();
}