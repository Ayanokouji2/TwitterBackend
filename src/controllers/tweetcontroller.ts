import { Response, NextFunction } from "express";
const { prisma } = require("../exportPrisma/prisma.db");

const getTweet = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userEmail = req.userId as string;

        const user = await prisma.tweet.findMany({
            where: {
                user: {
                    email: userEmail,
                },
            },
        });

        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

const postTweet = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { content, image } = req.body;
        const userEmail = req.userId as string;
        console.log("userEmail", req.userId);

        const createdTweet = await prisma.tweet.create({
            data: {
                content,
                image,
                user: {
                    connect: {
                        email: userEmail,
                    },
                },
            },
        });

        res.status(201).json(createdTweet);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

const getTweetById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const tweetID = req.params.id;
        const userEmail = req.userId;

        const Tweet = await prisma.tweet.findUnique({
            where: {
                id: tweetID,
            },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        });

        if (userEmail !== Tweet.user.email) {
            return res.status(402).json({
                message: "Unauthorized",
            });
        }

        res.status(200).json({
            message: "tweet fetched successfully",
            Tweet,
        });
    } catch (error: any) {
        res.status(400).json({
            message: "Error While Fetching The Tweet",
            error: error.message,
        });
    }
};
const updateTweet = async (req: any, res: Response, next: NextFunction) => {
    try {
        const toUpdate = req.body;
        const tweetID = req.params.id;
        const userEmail = req.userId as string;

        const tweet = await prisma.tweet.findUnique({
            where: { id: tweetID },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        });

        if (tweet.user.email !== userEmail) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const updatedTweet = await prisma.tweet.update({
            where: { id: tweetID },
            data: toUpdate,
        });

        res.status(200).json({
            message: "Tweet updated successfully",
            updatedTweet,
        });
    } catch (error: any) {
        res.status(400).json({
            message: "Error While Fetching Your Tweet",
            error: error.message,
        });
    }
};

const deleteTweet = async (req: any, res: Response, next: NextFunction) => {
    try {
        const tweetID = req.params.id;
        const userEmail = req.userId;

        const Tweet = await prisma.tweet.findUnique({
            where: {
                id: tweetID,
            },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        });

        if (userEmail !== Tweet.user.email) {
            return res.status(402).json({
                message: "Unauthorized",
            });
        }
        const deleteTweet = await prisma.tweet.delete({
            where: { id: tweetID },
        });

        res.status(200).json({
            message: "tweet deleted successfully",
            deleteTweet,
        });
    } catch (error: any) {
        res.status(400).json({
            message: "Error While Fetching The Tweet",
            error: error.message,
        });
    }
};

export { getTweet, postTweet, getTweetById, updateTweet, deleteTweet };
