import { API_URL } from "./api.js";

export async function getAllMessages(token) {
    const response = await fetch(
        API_URL + "/messages",
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

    const getMessagesResponse = await response.json();
    console.log("getMessagesResponse:", getMessagesResponse);

    return getMessagesResponse;
}

export async function createMessage(message, token) {
    const response = await fetch(API_URL + "/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`

        },
        body: JSON.stringify(message),
    });


    const postCreateMessageResponse = await response.json();

    return postCreateMessageResponse;
}

export async function deleteMessage(messageId, token) {
    const response = await fetch(
        API_URL + "/messages/" + messageId,
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${token}`

            },
        }
    )
    const deleteMessageResponse = await response.json()
    return deleteMessageResponse
}
