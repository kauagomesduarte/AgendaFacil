import type { Request, Response, NextFunction } from "express";
import { createUserSchema, updateUserSchema, type CreateUserDTO, type UpdateUserDTO } from "../dtos/user.dto.js";

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

    const data: CreateUserDTO = validator.data

    req.body = data;

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

    const data: UpdateUserDTO = validator.data

    req.body = data;

    next();
}