import { ObjectId } from "mongodb";
import { db } from "../database/mongodb.js";

export function Comments(id, name, comment, postDate) {
    return {
        id,
        name,
        comment,
        postDate
    };
}

export async function create(message) {
    delete message.id;

    return db
        .collection("Blog")
        .insertOne(message)
        .then((result) => {
            delete message._id;
            return { ...message, id: result.insertedId.toString() };
        });
}




export async function getAll() {
    let allMessagesResults = await db.collection("Blog").find().sort({ postDate: -1 }).toArray();
    return allMessagesResults.map((messageResult) => ({
        id: messageResult._id.toString(),
        name: messageResult.name,
        comment: messageResult.comment,
        postDate: messageResult.postDate,

    }));
}

export async function deleteByID(messageID) {
    console.log("🚀 ~ file: blog.js:41 ~ deleteByID ~ messageID:", messageID)
    return db.collection("Blog").deleteOne({ _id: new ObjectId(messageID) });
}
