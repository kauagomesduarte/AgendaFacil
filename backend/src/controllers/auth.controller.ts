import type {Request, Response} from 'express';
import * as authService from "../services/auth.service.js";

export async function authenticateUser(req: Request, res: Response){
    const {email, password} = req.body;
    const token = await authService.authenticateUser(email, password);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
    });
    
    res.status(200).json({
        message: "Logged in successfully."
    })
}

export async function getAuthenticatedUser(req: Request, res: Response){
    const userId = req.user?.id;
    if (userId === undefined) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await authService.getAuthenticatedUser(userId);
    return res.status(200).json(user);
}

export function logout(req: Request, res: Response){
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
    });
    return res.status(204).send();
}