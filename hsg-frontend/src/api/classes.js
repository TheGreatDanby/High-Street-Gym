import { API_URL } from "./api.js";

export async function getAllClasses(token) {
    const response = await fetch(
        API_URL + "/classes",
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`
            },
        }
    );
    const getClassesResponse = await response.json()
    return getClassesResponse.classesObj;
}



export async function getClassesByID(classesID, token) {
    const response = await fetch(
        API_URL + "/classes/" + classesID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
        })
    const getClassesByIdResponse = await response.json()
    return getClassesByIdResponse.classes
}

export async function createClasses(classes, token) {
    const response = await fetch(
        API_URL + "/classes",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
            body: JSON.stringify(classes)
        }
    )
    const postCreateClassesResponse = await response.json()
    return postCreateClassesResponse.classes
}



export async function updateClasses(classes, token) {
    console.log("🚀 ~ file: classes.js:88 ~ updateClasses ~ classes:", classes)
    const response = await fetch(
        API_URL + "/classes",
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
            body: JSON.stringify(classes)
        }
    )

    const patchClassesResult = await response.json()

    return patchClassesResult
}



export async function updateBooking(booking, token) {
    console.log("🚀 ~ file: classes.js:120 ~ updateBooking ~ sessionDate:", booking.sessionDate)
    const response = await fetch(
        API_URL + "/booking",
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
            body: JSON.stringify(booking)
        }
    )

    const patchBookingResult = await response.json()

    return patchBookingResult
}

export async function updateSession(session, token) {
    console.log("🚀 ~ file: classes.js:139 ~ updateSession ~ session:", session)
    const response = await fetch(
        API_URL + "/session",
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
            body: JSON.stringify(session)
        }
    )
    console.log("🚀 ~ file: classes.js:148 ~ updateSession ~ session:", session)

    const patchSessionResult = await response.json()

    return patchSessionResult
}


export async function deleteClasses(classID, token) {
    const response = await fetch(
        API_URL + "/classes/" + classID,
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
        }
    )
    const deleteClassesResponse = await response.json()
    return deleteClassesResponse
}

export async function deleteSession(sessionID, token) {
    const response = await fetch(
        API_URL + "/session/" + sessionID,
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
        }
    )
    const deleteSessionResponse = await response.json()
    return deleteSessionResponse
}

export async function getBookingByID(bookingID, token) {
    const response = await fetch(
        API_URL + "/bookings/" + bookingID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
        })
    const getBookingByIdResponse = await response.json()
    return getBookingByIdResponse.booking
}

export async function getSessionByID(sessionID, token) {
    console.log("🚀 ~ file: classes.js:186 ~ getSessionByID ~ sessionID:", sessionID)
    const response = await fetch(
        API_URL + "/session/" + sessionID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
        })
    const getSessionByIdResponse = await response.json()
    return getSessionByIdResponse.session
}

export async function getBookingsByClassID(classSessionId, token) {
    const response = await fetch(
        API_URL + "/bookings/class/" + classSessionId,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
        }
    );
    const getBookingByClassIDResponse = await response.json()
    return getBookingByClassIDResponse.bookings;
}

export async function getSessionsByClassID(classSessionId, token) {
    console.log("🚀 ~ file: classes.js:231 ~ getSessionsByClassID ~ classSessionId:", classSessionId)
    const response = await fetch(
        API_URL + "/sessions/class/" + classSessionId,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
        }
    );
    const getSessionByClassIDResponse = await response.json()
    return getSessionByClassIDResponse.sessions;
}




export async function createBooking(booking, token) {
    const response = await fetch(
        API_URL + "/booking",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
            body: JSON.stringify(booking)
        }
    )
    const postCreateBookingResponse = await response.json()
    return postCreateBookingResponse.booking
}

export async function createSession(session, token) {
    console.log("🚀 ~ file: classes.js:242 ~ createSession ~ session:", session)
    const response = await fetch(
        API_URL + "/session",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
            body: JSON.stringify(session)
        }
    )
    const postCreateSessionResponse = await response.json()
    return postCreateSessionResponse.session
}

export async function deleteBooking(booking, token) {
    const response = await fetch(
        API_URL + "/booking",
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
            body: JSON.stringify(booking)
        }
    )
    const deleteBookingResponse = await response.json()
    return deleteBookingResponse.booking
}



export async function getAllBookings(token) {
    const response = await fetch(
        API_URL + "/bookings",
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
        }
    );
    const getBookingsResponse = await response.json();
    return getBookingsResponse.bookingsObj;
}

export async function getAllSessions(token) {
    const response = await fetch(
        API_URL + "/sessions",
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
        }
    );
    const getSessionsResponse = await response.json();
    console.log("🚀 ~ file: classes.js:376 ~ getAllSessions ~ getSessionsResponse:", getSessionsResponse)
    return getSessionsResponse.sessionsObj;
}





