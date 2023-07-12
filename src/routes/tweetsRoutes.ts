import express from "express";
import {
    getTweet,
    postTweet,
    getTweetById,
    updateTweet,
    deleteTweet,
} from "../controllers/tweetcontroller";

const router = express.Router();

// Get all Tweets And Create Tweets End Points

router.route("/")
.get(getTweet)
.post(postTweet);

router.route("/:id")
.get(getTweetById)
.patch(updateTweet)
.delete(deleteTweet);

export default router;
