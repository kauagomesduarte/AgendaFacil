import type { Jwt } from "jsonwebtoken";
import type { UserDTO } from "../dtos/user.dto.js";
import { findByEmail } from "../repository/user.repository.js";
import { createJWT } from "../utils/jwt.js";
import bcrypt from 'bcrypt';

export async function authenticateUser(email: string, password: string): Promise<string>{
    const existingUser: UserDTO | null = await findByEmail(email);
    if (!existingUser) throw new Error("E-mail not registered to an account.");

    const correctPassword = await bcrypt.compare(password, existingUser.password);
    if (!correctPassword) throw new Error("Incorrect password.");

    const payload: Object = {
        id: existingUser.id,
        email: existingUser.email
    }
    return createJWT(payload);
}  