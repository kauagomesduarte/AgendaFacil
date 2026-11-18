import type { UserDTO } from "../dtos/user.dto.js";
import { findByEmail } from "../repositories/user.repository.js";
import { createJWT } from "../utils/jwt.js";
import bcrypt from 'bcrypt';
import { AppError } from "../utils/appError.js";

export async function authenticateUser(email: string, password: string): Promise<string>{
    const existingUser: UserDTO | null = await findByEmail(email);
    if (!existingUser) throw new AppError("E-mail not registered to an account", 400);

    const correctPassword = await bcrypt.compare(password, existingUser.password);
    if (!correctPassword) throw new AppError("Incorrect password", 400);

    const payload = {
        id: existingUser.id,
        email: existingUser.email
    }
    return createJWT(payload);
}  