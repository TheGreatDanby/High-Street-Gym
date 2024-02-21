import { Router } from "express";
import { Comments, create, getAll, deleteByID } from "../models/blog.js";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import auth from "../middleware/auth.js";

dayjs.extend(utc);
dayjs.extend(timezone);



const messageController = Router();


messageController.get(
    "/messages",
    auth(["Admin", "Trainer", "Member"]),

    (req, res) => {
        getAll()
            .then((messages) => {
                res.status(200).json({
                    status: 200,
                    message: "Get all messages",
                    messages: messages,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to get all messages",
                });
            });
    });

messageController.post("/messages",
    auth(["Admin", "Trainer", "Member"]),

    (req, res) => {
        const commentData = req.body;
        const postDateString = dayjs().tz("Australia/Brisbane").format();
        const postDate = new Date(postDateString);



        const comment = Comments(
            null,
            commentData.name,
            commentData.comment,
            postDate
        );

        create(comment)
            .then((createdComment) => {
                res.status(200).json({
                    status: 200,
                    message: "Created message",
                    post: createdComment,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to create message",
                });
            });
    });

messageController.delete("/messages/:id",
    auth(["Admin"]),

    (req, res) => {
        const messageID = req.params.id;

        deleteByID(messageID)
            .then((result) => {
                res.status(200).json({
                    status: 200,
                    message: "Deleted message by ID",
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to delete message by ID",
                });
            });
    });

export default messageController;
