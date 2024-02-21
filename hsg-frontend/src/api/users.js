import { API_URL } from "./api";

export async function verifyToken(token) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };


    try {
        const response = await fetch(
            `${API_URL}/users/verify-token`,
            {
                method: "POST",
                headers: headers,

            }
        );

        if (!response.ok) {
            throw new Error(`Token verification failed with status: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Token verification API call failed: ", error);
        throw error;
    }
}



export async function login(email, password) {
    try {
        const response = await fetch(
            `${API_URL}/users/login`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Login failed with status: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Login response data:", data);
        return data;

    } catch (error) {
        console.error("Login API call failed: ", error);
        throw error;
    }
}


export async function deleteUser(userId, token) {
    console.log("🚀 ~ file: users.js:24 ~ deleteUser ~ deleteUser:", deleteUser)
    const response = await fetch(
        API_URL + "/users/" + userId,
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + token

            },
        }
    )
    const deleteUserResponse = await response.json()
    return deleteUserResponse
}

export async function logout(authenticationKey, token) {
    const response = await fetch(
        API_URL + "/users/logout",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + token

            },
            body: JSON.stringify({
                authenticationKey
            })
        }
    )

    const APIResponseObject = response.json()

    return APIResponseObject
}


export async function getAllUsers(token) {
    const response = await fetch(
        API_URL + "/users",
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + token

            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.users
}



export async function getUserByID(userID, token) {
    const response = await fetch(
        API_URL + "/users/" + userID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + token

            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.user
}

export async function updateUser(user, token) {
    const response = await fetch(
        API_URL + "/users",
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + token

            },
            body: JSON.stringify(user)
        }
    )

    const patchUserResult = await response.json()

    return patchUserResult
}

export async function createUser(user, token) {
    const response = await fetch(
        API_URL + "/users/register",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + token

            },
            body: JSON.stringify(user)
        }
    )

    const patchUserResult = await response.json()

    return patchUserResult
}

export async function getByAuthenticationKey(authenticationKey, token) {
    const response = await fetch(
        API_URL + "/users/by-key/" + authenticationKey,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + token

            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.user
}