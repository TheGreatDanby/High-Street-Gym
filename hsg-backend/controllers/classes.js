import { Router } from "express";
// import { validate } from "../middleware/validator.js"
import xml2js from "xml2js"
import auth from "../middleware/auth.js";
import { Classes, Session } from "../models/classes.js";
import {
    getAll,
    getClassSessionsById,
    addBooking,
    getByID,
    deleteBooking,
    getAllBookings,
    createClass,
    updateClass,
    deleteClassByID,
    getBookingByID,
    getBookingsByClassID,
    updateBooking,
    createBooking,
    deleteBookingByID,
    createClassXML,
    updateSession,
    getSessionByID,
    createSession,
    deleteSessionByID,
    getAllSessions,
    getSessionsByClassID,
    updateClassXML,
} from "../models/classes-mdb.js";
import { db } from "../database/mongodb.js"





const classesController = Router({ mergeParams: true });


const getClassesListSchema = {
    type: "object",
    properties: {}
}

classesController.get(
    "/classes",
    auth(["Admin", "Trainer", "Member"]),

    // validate({ body: getClassesListSchema }),
    (req, res) => {
        // #swagger.summary = 'Get a all Classes'

        getAll().then(classesObj => {

            res.status(200).json({
                status: 200,
                message: "Get all classes",
                classesObj: classesObj
            })
        }).catch(error => {
            console.error("API call failed: ", error);
            res.status(500).json({
                status: 500,
                message: "Failed to get all classes",
            })
        })
    })

classesController.get(
    "/bookings",
    auth(["Admin", "Trainer", "Member"]),

    (req, res) => {
        // #swagger.summary = 'Get all Bookings'

        getAllBookings().then(bookingsObj => {

            res.status(200).json({
                status: 200,
                message: "Get all bookings",
                bookingsObj: bookingsObj
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get all bookings",
            })
        })
    })

classesController.get(
    "/sessions",
    auth(["Admin", "Trainer", "Member"]),

    (req, res) => {
        // #swagger.summary = 'Get all Sessions'

        getAllSessions().then(sessionsObj => {

            res.status(200).json({
                status: 200,
                message: "Get all sessions",
                sessionsObj: sessionsObj
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get all sessions",
            })
        })
    })


classesController.get("/classes/:classSessionId/booking",
    auth(["Admin", "Trainer", "Member"]),

    (req, res) => {
        const classSessionId = req.params.classSessionId;

        getClassSessionsById(classSessionId)
            .then((classSession) => {
                if (!classSession) {
                    res.status(404).json({
                        status: 404,
                        message: "Class not found",
                    });
                    return;
                }
                res.status(200).json({
                    status: 200,
                    message: "Get class sessions",
                    classSessionId: classSessionId,
                    sessions: classSession.bookings,
                });
            })
            .catch((error) => {
                console.error("Error fetching gym class sessions:", error);
                res.status(500).json({
                    status: 500,
                    message: "Failed to get class sessions",
                });
            })
    });

classesController.post("/classes/upload/xml",
    auth([
        "Admin",
        "Trainer"
    ]),
    (req, res) => {
        if (req.files && req.files["xml-file"]) {
            // Access the XML file as a string
            const XMLFile = req.files["xml-file"]
            const file_text = XMLFile.data.toString()
            console.log(file_text);


            // Set up XML parser
            const parser = new xml2js.Parser();
            parser.parseStringPromise(file_text)
                .then(data => {
                    const classUpload = data["classes-upload"]
                    const classUploadAttributes = classUpload["$"]
                    const operation = classUploadAttributes["operation"]
                    const classesData = classUpload["classes"][0]["class"]

                    if (operation == "insert") {
                        Promise.all(classesData.map((classData) => {
                            const classModel = Classes(null,
                                classData.Name.toString(),
                                classData.Description.toString(),
                                classData.Duration.toString(),
                                classData.Timeslot.toString(),
                                classData.Location.toString())
                            return createClassXML(classModel)
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
                        Promise.all(classesData.map((classData) => {
                            const classModel = Classes(
                                null,
                                classData.Name.toString(),
                                classData.Description.toString(),
                                classData.Duration.toString(),
                                classData.Timeslot.toString(),
                                classData.Location.toString())
                            return updateClassXML(classModel)
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


classesController.post("/classes/:classSessionId/session",
    auth(["Admin", "Trainer", "Member"]),

    (req, res) => {



        const classSessionId = req.params.classSessionId;
        const { sessionDate, participant } = req.body;
        const { userId, name } = participant;


        addBooking(classSessionId, sessionDate, userId, name)

            .then((newBooking) => {

                if (!newBooking) {
                    res.status(404).json({
                        status: 404,
                        message: "Class session not found",
                    });
                    return;
                }
                res.status(201).json({
                    status: 201,
                    message: "Booking created",
                    booking: newBooking,
                });
            })
            .catch((error) => {
                console.error("Error adding booking:", error);
                res.status(500).json({
                    status: 500,
                    message: "Failed to add booking",
                });
            });
    });

classesController.delete("/booking/:bookingId/",
    auth(["Admin", "Trainer", "Member"]),

    (req, res) => {
        const bookingId = req.params.bookingId;
        const { loggedInUserId } = req.body;

        deleteBookingByID(bookingId, loggedInUserId)
            .then((updatedBooking) => {
                if (!updatedBooking) {
                    res.status(404).json({
                        status: 404,
                        message: "Class session not found",
                    });
                    return;
                }
                res.status(200).json({
                    status: 200,
                    message: "Booking deleted",
                    booking: updatedBooking,
                });
            })
            .catch((error) => {
                console.error("Error deleting booking:", error);
                res.status(500).json({
                    status: 500,
                    message: "Failed to delete booking",
                });
            });
    });





const getClassesByIDSchema = {
    type: "object",
    properties: {
        id: {
            type: "string",
            // pattern: "^[0-9]+$",
            // minLength: 1,
            // maxLength: 4,
        }
    }
}

classesController.get(
    "/classes/:id",
    auth(["Admin", "Trainer", "Member"]),

    // validate({ params: getClassesByIDSchema }),
    (req, res) => {
        const classesID = req.params.id

        getByID(classesID).then(classes => {
            console.log("🚀 ~ file: classes.js:121 ~ getByID ~ classes:", classes);

            res.status(200).json({
                status: 200,
                message: "Get classes by ID",
                classes: classes
            })
        }).catch(error => {
            console.error("Error fetching class by ID:", error);

            res.status(500).json({
                status: 500,
                message: `Failed to get classes by ID. Error: ${error.message}`,
            })
        })

    })

classesController.get(
    "/bookings/:id",
    auth(["Admin", "Trainer", "Member"]),

    (req, res) => {
        const bookingID = req.params.id

        getBookingByID(bookingID).then(booking => {
            console.log("🚀 ~ file: bookings.js:121 ~ getBookingByID ~ booking:", booking);

            res.status(200).json({
                status: 200,
                message: "Get booking by ID",
                booking: booking
            })
        }).catch(error => {
            console.error("Error fetching booking by ID:", error);

            res.status(500).json({
                status: 500,
                message: `Failed to get booking by ID. Error: ${error.message}`,
            })
        })
    })

classesController.get(
    "/session/:id",
    auth(["Admin", "Trainer", "Member"]),

    (req, res) => {
        const sessionID = req.params.id
        console.log("🚀 ~ file: classes.js:325 ~ sessionID:", sessionID)

        getSessionByID(sessionID).then(session => {

            res.status(200).json({
                status: 200,
                message: "Get Session by ID",
                session: session
            })
        }).catch(error => {
            console.error("Error fetching session by ID:", error);

            res.status(500).json({
                status: 500,
                message: `Failed to get session by ID. Error: ${error.message}`,
            })
        })
    })

classesController.get(
    "/bookings/class/:classId",
    auth(["Admin", "Trainer", "Member"]),
    (req, res) => {
        const classId = req.params.classId;

        getBookingsByClassID(classId)
            .then(bookings => {
                res.status(200).json({
                    status: 200,
                    message: "Get bookings by class ID",
                    bookings: bookings
                })
            })
            .catch(error => {
                console.error("Error fetching bookings by class ID:", error);
                res.status(500).json({
                    status: 500,
                    message: `Failed to get bookings by class ID. Error: ${error.message}`,
                });
            });
    });

classesController.get(
    "/sessions/class/:classId",
    auth(["Admin", "Trainer", "Member"]),

    (req, res) => {
        const classId = req.params.classId;

        getSessionsByClassID(classId)
            .then(sessions => {
                res.status(200).json({
                    status: 200,
                    message: "Get sessions by class ID",
                    sessions: sessions
                })
            })
            .catch(error => {
                console.error("Error fetching sessions by class ID:", error);
                res.status(500).json({
                    status: 500,
                    message: `Failed to get sessions by class ID. Error: ${error.message}`,
                });
            });
    });



const createClassesSchema = {
    type: "object",
    required: ["name", "species"],
    properties: {
        name: {
            type: "string"
        },
        species: {
            type: "string"
        }
    }
}

classesController.post(
    "/classes",
    auth(["Admin", "Trainer"]),

    // validate({ body: createClassesSchema }),
    (req, res) => {

        const classesData = req.body
        const classes = Classes(
            null,
            classesData.Name,
            classesData.Description,
            classesData.Duration,
            classesData.Timeslot,
            classesData.Location,
        )

        createClass(db, classes).then(classes => {
            res.status(200).json({
                status: 200,
                message: "Created classes ",
                classes: classes,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to created classes ",
            })
        })

    })

classesController.post(
    "/session",
    auth(["Admin", "Trainer"]),

    (req, res) => {

        const sessionData = req.body

        const session = {
            // id: null,
            classSessionId: sessionData.classSessionId,
            sessionDate: sessionData.sessionDate,
            participants: sessionData.participants || [],
            Trainer: sessionData.Trainer
        }


        createSession(session).then(session => {
            res.status(200).json({
                status: 200,
                message: "Created session ",
                session: session,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to created session ",
            })
        })

    })

classesController.post("/booking",
    auth(["Admin", "Trainer", "Member"]),

    (req, res) => {
        const bookingData = req.body;

        updateBooking(bookingData)
            .then((booking) => {
                res.status(200).json({
                    status: 200,
                    message: "Updated booking",
                    booking: booking,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to update booking",
                    error: error.message,
                });
            });
    });



classesController.delete("/booking",
    auth(["Admin", "Trainer", "Member"]),

    (req, res) => {
        const bookingData = req.body;

        deleteBooking(bookingData)
            .then((booking) => {
                res.status(200).json({
                    status: 200,
                    message: "Cancelled booking",
                    booking: booking,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to cancel booking",
                    error: error.message,
                });
            });
    });




const updateClassesSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
        },
        name: {
            type: "string",
        },
        species: {
            type: "string"
        }
    }
}


classesController.patch(
    "/classes",
    auth(["Admin", "Trainer"]),

    // validate({ body: patchUpdateUserSchema }),
    (req, res) => {
        const classesData = req.body
        console.log("🚀 ~ file: classes.js:507 ~ classesData:", classesData)


        const classes = Classes(
            classesData.id,
            classesData.Name,
            classesData.Description,
            classesData.Duration,
            classesData.Timeslot,
            classesData.Location
        )
        console.log("🚀 ~ file: classes.js:658 ~ classes:", classes)

        updateClass(classes).then(classes => {
            console.log("🚀 ~ file: classes.js:662 ~ updateClass ~ classes:", classes)
            console.log("🚀 ~ file: classes.js:662 ~ updateClass ~ classes:", classes)
            res.status(200).json({
                status: 200,
                message: "Updated Class",
                classes: classes
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to update Class"
            })
        })


    }
)

classesController.patch(
    "/session",
    auth(["Admin", "Trainer"]),

    // validate({ body: patchUpdateUserSchema }),

    (req, res) => {
        const sessionData = req.body
        console.log("🚀 ~ file: classes.js:565 ~ sessionData:", sessionData)

        const session = {
            id: sessionData._id,
            sessionDate: sessionData.sessionDate,
            Trainer: sessionData.Trainer,
        };

        updateSession(session).then(session => {
            console.log("🚀 ~ file: classes.js:575 ~ updateSession ~ session:", session)
            res.status(200).json({
                status: 200,
                message: "Updated session",
                session: session
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to update session"
            })
        })


    }
)


classesController.delete("/classes/:id",
    auth(["Admin"]),

    (req, res) => {
        const classesID = req.params.id;
        deleteClassByID(classesID)
            .then(result => {
                res.status(200).json({
                    status: 200,
                    message: "Deleted classes by ID"
                })
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to delete classes by ID"
                })
            })
    })


classesController.delete("/session/:id",
    auth(["Admin", "Trainer"]),
    (req, res) => {
        const sessionID = req.params.id;
        deleteSessionByID(sessionID)
            .then(result => {
                res.status(200).json({
                    status: 200,
                    message: "Deleted session by ID"
                })
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to delete session by ID"
                })
            })
    })

export default classesController