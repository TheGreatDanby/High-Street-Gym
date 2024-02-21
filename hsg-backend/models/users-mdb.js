import { ObjectId } from "mongodb"
import { User } from "./users.js"
import { db } from "../database/mongodb.js"
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;



export async function getAll() {
    const allUserResults = await db.collection("users").find().toArray()
    return await allUserResults.map(userResult =>
        User(
            userResult._id.toString(),
            userResult.email,
            null,
            // userResult.password,
            userResult.role,
            userResult.firstName,
            userResult.lastName,
            null,
            // userResult.authenticationKey,
        )
    )
}



export async function getByID(userID) {
    let userResult = await db.collection("users")
        .findOne({ _id: new ObjectId(userID) })

    if (userResult) {
        console.log("User data from database:", userResult);

        return Promise.resolve(
            User(
                userResult._id.toString(),
                userResult.email,
                null,
                // userResult.password,
                userResult.role,
                userResult.firstName,
                userResult.lastName,
                null,
                // userResult.authenticationKey,
            )
        )
    } else {
        return Promise.reject("no user found with this ID")
    }
}

export async function getUsersByRole(role) {
    let usersResult = await db.collection("users")
        .find({ role: role }).toArray();

    if (usersResult.length > 0) {
        return usersResult.map(user =>
            new User(
                user._id.toString(),
                user.email,
                null,
                // user.password,
                user.role,
                user.firstName,
                user.lastName,
                null,
                // user.authenticationKey, 
            )
        );
    } else {
        return Promise.reject("No users found with the role " + role);
    }
}


export async function getByEmail(email) {
    let userResult = await db.collection("users").findOne({ email })

    if (userResult) {
        return Promise.resolve(
            User(
                userResult._id.toString(),
                userResult.email,
                userResult.password,
                userResult.role,
                userResult.firstName,
                userResult.lastName,
            )
        )
    } else {
        return Promise.reject("no user found with this email")
    }
}

export async function getByAuthenticationKey(authenticationKey) {
    let userResult = await db.collection("users")
        .findOne({ authenticationKey })

    if (userResult) {
        return Promise.resolve(
            User(
                userResult._id.toString(),
                userResult.email,
                userResult.password,
                userResult.role,
                userResult.firstName,
                userResult.lastName,
                userResult.authenticationKey,
            )
        )
    } else {
        return Promise.reject("no user found with this key")
    }
}

export async function verifyTokenAndGetUser(jwtToken) {
    try {
        const decoded = jwt.verify(jwtToken, JWT_SECRET);


        const userEmail = decoded.email;

        let userResult = await db.collection("users").findOne({ email: userEmail });

        if (userResult) {
            return Promise.resolve(
                User(
                    userResult._id.toString(),
                    userResult.email,
                    userResult.password,
                    userResult.role,
                    userResult.firstName,
                    userResult.lastName,
                )
            );
        } else {
            return Promise.reject("No user found with this email");
        }
    } catch (error) {
        return Promise.reject("Invalid token or token expired");
    }
}

export async function create(user) {
    delete user.id
    return db.collection("users").insertOne(user).then(result => {
        delete user._id
        return { ...user, id: result.insertedId.toString() }
    })
}

export async function update(user) {
    const userID = new ObjectId(user.id)
    delete user.id
    const userUpdateDocument = {
        "$set": user
    }
    return db.collection("users").updateOne({ _id: userID }, userUpdateDocument)
}
export async function updateUserXML(user) {
    const userEmail = user.email;
    const userUpdateDocument = {
        "$set": user
    }
    return db.collection("users").updateOne({ email: userEmail }, userUpdateDocument)
}

export async function createUserXML(user) {
    // delete classes.id

    let result = await db.collection("users").insertOne({ ...user })

    return Promise.resolve({ ...result, id: result.insertedId.toString() })
}

export async function deleteByID(userID) {
    return db.collection("users").deleteOne({ _id: new ObjectId(userID) })
}