import { Router } from "express";
import jwt from "jsonwebtoken";
const { prisma } = require("../exportPrisma/prisma.db");
const secret_key: string = process.env.SECRET_KEY as string;

const router = Router();
const Expiration_Time_For_Token_IN_Minutes = 10;
const Expiration_Time_For_Token_IN_HOURS = 24;

function generateToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateJWTToken({
    tokenId,
    userEmail,
}: {
    tokenId: string;
    userEmail: string;
}): string {
    const payload = { tokenId, userEmail };
    return jwt.sign(payload, secret_key);
}

router.post("/login", async (req, res) => {
    const { email } = req.body;

    try {
        const token = generateToken();
        const expirationDate = new Date(
            new Date().getTime() +
                Expiration_Time_For_Token_IN_Minutes * 60 * 1000
        );
        const createdToken = await prisma.token.create({
            data: {
                type: "EMAIL",
                token: token,
                expiration: expirationDate,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: {
                            email,
                            username: "username",
                            name: email.split("@")[0],
                        },
                    },
                },
            },
        });
        res.status(200).json(createdToken);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/authenticate", async (req, res) => {
    try {
        const { email, token } = req.body;

        const dbEmailToken = await prisma.token.findUnique({
            where: { token },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        id: true,
                    },
                },
            },
        });
        if (
            !dbEmailToken ||
            !dbEmailToken.valid ||
            dbEmailToken.user.email !== email ||
            dbEmailToken.expiration < new Date()
        ) {
            return res.status(401).json({ message: "Invalid EmailToken" });
        }

        const expirationDate = new Date(
            new Date().getTime() +
                Expiration_Time_For_Token_IN_HOURS * 60 * 60 * 1000
        );

        const APItoken = generateToken();
        const APIToken = await prisma.token.create({
            data: {
                type: "API",
                expiration: expirationDate,
                token: APItoken,
                user: {
                    connect: {
                        email,
                    },
                },
            },
        });

        await prisma.token.delete({
            where: { id: dbEmailToken.id },
        });

        const JWTtoken = generateJWTToken({
            tokenId: APIToken.id,
            userEmail: email,
        });

        res.status(200).json({ JWTtoken });
    } catch (error: any) {
        // console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
