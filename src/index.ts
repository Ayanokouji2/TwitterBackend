import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes";
import tweetRoutes from "./routes/tweetsRoutes";
import authRouter from "./routes/authRouter";
import { authenticateToken } from "./middlewares/authware";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/tweet", authenticateToken, tweetRoutes);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
