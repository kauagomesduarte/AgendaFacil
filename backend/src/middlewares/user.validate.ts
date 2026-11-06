import type { Request, Response, NextFunction } from "express";
import type { CreateUserDTO } from "../dtos/user.dto.js";
import z from 'zod';
import { createUserSchema, updateUserSchema } from "../dtos/user.dto.js";

export function validateCreateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const validator = createUserSchema.safeParse(req.body);

    if (!validator.success){
        return res.status(400).json({
        message: "Dados inválidos",
        errors: validator.error.issues
    });
    }

    req.body = validator.data;

    next();
}

export function validateUpdateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const validator = updateUserSchema.safeParse(req.body);

    if (!validator.success){
        return res.status(400).json({
        message: "Dados inválidos",
        errors: validator.error.issues
    });
    }

    req.body = validator.data;

    next();
}