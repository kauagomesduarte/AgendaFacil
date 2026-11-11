import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;
const expiresIn = process.env.JWT_EXPIRES_IN;

export function createJWT(payload: jwt.JwtPayload): string{
    const token = jwt.sign(
        payload,
        secret,
        {expiresIn: expiresIn as NonNullable<jwt.SignOptions["expiresIn"]>}
    )

    return token;
}

export function validateJWT(token: string){
    return jwt.verify(token, secret)
}