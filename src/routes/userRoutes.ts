import express from "express";
const { prisma } = require("../exportPrisma/prisma.db");

const router = express.Router();

// Get all  User And Create User End Points
router
    .route("/")
    .get(async (req, res) => {
        try {
            const users = await prisma.user.findMany({});
            res.json(users);
        } catch (error: any) {
            res.status(500).json({
                message: `Request failed Please try again${error.message}`,
            });
        }
    })
    .post(async (req, res) => {
        try {
            const { email, username } = req.body;

            var user = await prisma.user.findMany({
                where: { OR: [{ email }, { username }] },
            });
            console.log(user,"fetched from DB");
            if (user && user[0]) {
                return res.status(409).json({
                    message:
                        "User already exists or Username is already in Use",
                });
            }

            var newUser = await prisma.user.create({ data: req.body });
            res.status(201).json({
                message: `User Created successfully`,
                newUser,
            });
        } catch (error: any) {
            res.status(500).json({
                message: `Request failed Please try again${error.message}`,
            });
        }
    });

// Get User By Id , Update , Delete End Points
router
    .route("/:id")
    .get(async (req, res) => {
        try {
            const { id } = req.params;
            var user = await prisma.user.findUnique({ where: { id } });
            console.log(user)
            if ( !user ) {
                return res.status(404).json({
                    message: "User does not exists , check and try again...",
                });
            }

            res.status(200).json({
                message: ` User With the Id : ${id}`,
                user,
            });
        } catch (error: any) {
            res.status(500).json({
                message: `Request failed Please try again${error.message}`,
            });
        }
    })
    .patch(async (req, res) => {
        try {
            const { id } = req.params;
            const body = req.body;
            var user = await prisma.user.findUnique({ where: { id } });
            if (!user) {
                return res.status(402).json({
                    message: "User does not exists , check and try again...",
                });
            }

            user = await prisma.user.update({
                where: { id },
                data: { ...body },
            });
            res.status(200).json({
                message: ` User With the Id : ${id} has been Updated successfully`,
                user,
            });
        } catch (error: any) {
            res.status(500).json({
                message: `Request failed Please try again${error.message}`,
            });
        }
    })
    .delete(async (req, res) => {
        try {
            const { id } = req.params;
            var user = await prisma.user.findUnique({ where: { id } });
            if (!user) {
                res.status(402).json({
                    message: "User does not exists , check and try again...",
                });
            }

            user = await prisma.user.delete({ where: {id} });
            res.status(200).json({
                message: ` User With the Id : ${id} has been deleted`,
                user
            });
        } catch (error: any) {
            res.status(500).json({
                message: `Request failed Please try again${error.message}`,
            });
        }
    });

export default router;
