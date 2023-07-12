import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export async function authenticateToken(
    req: any,
    res: Response,
    next: NextFunction
) {
    try {
        const authJWTToken = req.headers["authorization"]?.split(
            " "
        )[1] as string;
        if (!authJWTToken) {
            return res.status(401).json({ error: "Invalid User" });
        }

        const payload = jwt.verify(
            authJWTToken,
            process.env.SECRET_KEY as string
        ) as { tokenId: string; userEmail: string };
        req.userId = payload?.userEmail;

        next();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
