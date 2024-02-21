import { Router } from "express";
import bcrypt from "bcryptjs"
import xml2js from "xml2js"
import jwt from 'jsonwebtoken';
import 'dotenv/config'



import auth from "../middleware/auth.js";

import { User } from "../models/users.js";
import { create, deleteByID, getByAuthenticationKey, getByEmail, getByID, update, getAll, createUserXML, updateUserXML, getUsersByRole } from "../models/users-mdb.js";


const userController = Router()

const postUserLoginSchema = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: {
            pattern: "^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$",
            type: "string"
        },
        password: {
            type: "string"
        }
    }
}

userController.post("/users/verify-token",
    auth(["Admin", "Trainer", "Member"]),
    (req, res) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ isValid: false, message: "Missing or invalid Authorization header" });
        }
        const token = authHeader.split('Bearer ')[1];
        if (!token) {
            return res.status(400).json({ isValid: false, error: "Token not provided." });
        }
        console.log("Received token API:", token);



        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            getByEmail(decoded.email)
                .then(user => {
                    if (user) {
                        res.status(200).json({ isValid: true, user });
                    } else {
                        res.status(400).json({ isValid: false, error: "User not found." });
                    }
                })
                .catch(error => {
                    console.error("Error fetching user: ", error);
                    res.status(500).json({ isValid: false, error: "Failed to fetch user." });
                });

        } catch (err) {
            console.error("JWT verification error: ", err);
            res.status(400).json({ isValid: false, error: "Invalid token." });
        }
    });



userController.post("/users/login",
    // auth(["Admin", "Trainer", "Member"]),

    // validate({ body: postUserLoginSchema }),
    (req, res) => {
        const loginData = req.body;

        getByEmail(loginData.email)
            .then(user => {
                if (bcrypt.compareSync(loginData.password, user.password)) {
                    // Generate JWT
                    const tokenPayload = {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    };

                    const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

                    res.status(200).json({
                        status: 200,
                        message: "user logged in",
                        token: token,
                        user: {
                            id: user.id,
                            email: user.email,
                            role: user.role
                        }
                    });
                } else {
                    res.status(400).json({
                        status: 400,
                        message: "invalid credentials"
                    });
                }
            })

            .catch(error => {
                console.error("Login controller error: ", error);
                if (error === "no user found") {
                    res.status(400).json({
                        status: 400,
                        message: "invalid credentials"
                    });
                } else {
                    res.status(500).json({
                        status: 500,
                        message: "login failed"
                    });
                }
            })

    }
);


//// User logout endpoint
const postUserLogoutSchema = {
    type: "object",
    required: ["authenticationKey"],
    properties: {
        authenticationKey: {
            type: "string"
        }
    }
}

userController.post(
    "/users/logout",
    auth(["Admin", "Trainer", "Member"]),
    // validate({ body: postUserLogoutSchema }),
    (req, res) => {
        const authenticationKey = req.body.authenticationKey
        getByAuthenticationKey(authenticationKey)
            .then(user => {
                user.authenticationKey = null
                update(user)
                    .then(user => {
                        res.status(200).json({
                            status: 200,
                            message: "user logged out"
                        })
                    })
            }).catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "failed to logout user"
                })
            })

    }
)


userController.get("/users",
    auth(["Admin", "Trainer", "Member"]),
    async (req, res) => {
        try {
            let users;
            console.log("Logged in user data:", req.user);

            if (req.user.role === "Member") {
                users = [req.user];
            } else if (req.user.role === "Trainer") {
                const members = await getUsersByRole("Member");
                const trainerDetails = await getByID(req.user.id)
                users = [trainerDetails, ...members];

            } else {
                users = await getAll();
            }

            console.log("Final users data to send:", users);

            res.status(200).json({
                status: 200,
                message: "User list",
                users: users,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Error fetching users",
                error: error.message,
            });
        }
    });





userController.get(
    "/users/:id",
    auth(["Admin", "Trainer", "Member"]),

    // validate({ params: getUserByIDSchema }),
    (req, res) => {
        const userID = req.params.id
        console.log("Logged in user data:", req.user); // Log the logged-in user's data


        getByID(userID).then(user => {
            console.log("Final users data to send:", user);

            res.status(200).json({
                status: 200,
                message: "Get user by ID",
                user: user,
            })
            console.log("Final users data to send:", user);

        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get user by ID"
            })
        })
    }
)

//// Get user by authentication key endpoint
const getUserByAuthenticationKeySchema = {
    type: "object",
    required: ["authenticationKey"],
    properties: {
        authenticationKey: {
            type: "string"
        }
    }
}

userController.get(
    "/users/by-key/:authenticationKey",
    auth(["Admin", "Trainer", "Member"]),

    // validate({ params: getUserByAuthenticationKeySchema }),
    (req, res) => {
        const userAuthKey = req.params.authenticationKey
        getByAuthenticationKey(userAuthKey).then(user => {
            res.status(200).json({
                status: 200,
                message: "Get user by authentication key",
                user: user,
            })
        }).catch(error => {
            console.log(error)
            res.status(500).json({
                status: 500,
                message: "Failed to get user by authentication key"
            })
        })
    }
)

//// Create user endpoint
const postCreateUserSchema = {
    type: "object",
    required: [
        "email",
        "password",
        "role",
        "firstName",
        "lastName"
    ],
    properties: {
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
        role: {
            type: "string"
        },
        firstName: {
            type: "string"
        },
        lastName: {
            type: "string"
        },
    }
}

userController.post(
    "/users/register",
    auth([
        "Admin",
        "Trainer"
    ]),

    // [
    // validate({ body: postCreateUserSchema }),
    // ],
    (req, res) => {
        // #swagger.summery = 'Create New User'
        const userData = req.body
        console.log("🚀 ~ file: users.js:233 ~ userData:", userData)

        if (!userData.password.startsWith("$2a")) {
            userData.password = bcrypt.hashSync(userData.password)
        }

        const user = User(
            null,
            userData.email,
            userData.password,
            userData.role,
            userData.firstName,
            userData.lastName,
            null
        )

        create(user).then(user => {
            res.status(200).json({
                status: 200,
                message: "Created user",
                user: user
            })
        }).catch(error => {
            console.log("🚀 ~ file: users.js:258 ~ create ~ error:", error)
            res.status(500).json({
                status: 500,
                message: "Failed to create user"
            })
        })
    }
)

//// Update user endpoint
const patchUpdateUserSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string"
        },
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
        role: {
            type: "string"
        },
        firstName: {
            type: "string"
        },
        lastName: {
            type: "string"
        },
    }
}



userController.patch(
    "/users",
    auth(["Admin", "Trainer", "Member"]),
    (req, res) => {
        const userData = req.body

        const updateData = {
            id: userData.id,
            email: userData.email,
            role: userData.role,
            firstName: userData.firstName,
            lastName: userData.lastName,
        };

        if (userData.password && userData.password.trim() !== "") {
            updateData.password = bcrypt.hashSync(userData.password);
        }

        update(updateData).then(user => {
            res.status(200).json({
                status: 200,
                message: "Updated user",
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to update user"
            })
        })
    }
)


userController.post("/users/upload/xml",
    auth(["Admin"]),
    (req, res) => {
        if (req.files && req.files["xml-file"]) {
            const XMLFile = req.files["xml-file"]
            const file_text = XMLFile.data.toString()
            console.log(file_text);


            const parser = new xml2js.Parser();
            parser.parseStringPromise(file_text)
                .then(data => {
                    const userUpload = data["users-upload"]
                    const userUploadAttributes = userUpload["$"]
                    const operation = userUploadAttributes["operation"]
                    const usersData = userUpload["users"][0]["user"]

                    if (operation == "insert") {
                        Promise.all(usersData.map((userData) => {
                            if (!userData.Password.toString().startsWith("$2a")) {
                                userData.Password = bcrypt.hashSync(userData.Password.toString(), 10);
                            }

                            const userModel = User(
                                null,
                                userData.Email.toString(),
                                userData.Password.toString(),
                                userData.Role.toString(),
                                userData.FirstName.toString(),
                                userData.LastName.toString(),
                                userData.AuthenticationKey ? userData.AuthenticationKey.toString() : null
                            );
                            return createUserXML(userModel)
                        })).then(results => {
                            res.status(200).json({
                                status: 200,
                                message: "XML Upload insert successful",
                            })
                        }).catch(error => {
                            res.status(500).json({
                                status: 500,
                                message: "XML upload failed on database operation - " + error,
                            })
                        })
                    } else if (operation == "update") {
                        Promise.all(usersData.map((userData) => {
                            const userModel = User(
                                null,
                                userData.Email.toString(),
                                userData.Password.toString(),
                                userData.Role.toString(),
                                userData.FirstName.toString(),
                                userData.LastName.toString(),
                                userData.AuthenticationKey ? userData.AuthenticationKey.toString() : null
                            );
                            return updateUserXML(userModel)
                        })).then(results => {
                            res.status(200).json({
                                status: 200,
                                message: "XML Upload update successful",
                            })
                        }).catch(error => {
                            res.status(500).json({
                                status: 500,
                                message: "XML upload failed on database operation - " + error,
                            })
                        })

                    } else {
                        res.status(400).json({
                            status: 400,
                            message: "XML Contains invalid operation attribute value",
                        })
                    }
                })
                .catch(error => {
                    res.status(500).json({
                        status: 500,
                        message: "Error parsing XML - " + error,
                    })
                })


        } else {
            res.status(400).json({
                status: 400,
                message: "No file selected",
            })
        }
    })

//// Delete user endpoint
const deleteUserByIDSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string"
        }
    }
}

userController.delete("/users/:id",
    auth(["Admin"]),

    // validate({ params: deleteUserByIDSchema }),
    (req, res) => {
        const userID = req.params.id

        deleteByID(userID)
            .then(result => {
                res.status(200).json({
                    status: 200,
                    message: "Deleted User by ID"
                })
            }).catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to delete user by ID"
                })
            })
    }
)

export default userController