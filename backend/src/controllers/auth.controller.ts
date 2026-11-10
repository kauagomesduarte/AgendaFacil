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