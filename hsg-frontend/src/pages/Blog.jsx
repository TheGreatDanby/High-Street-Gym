import React, { useState, useEffect } from "react";
import { useAuthentication } from "../hooks/authentication";
import Swal from "sweetalert2";

import { getAllMessages, createMessage, deleteMessage } from "../api/blog";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const {
    authenticatedUser: user,
    authenticatedUser,
    jwtToken,
  } = useAuthentication();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const allMessages = await getAllMessages(jwtToken);
      console.log("All messages:", allMessages);

      setMessages(allMessages.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const postMessage = async () => {
    try {
      await createMessage(
        {
          name: authenticatedUser.firstName,
          comment: inputMessage,
        },
        jwtToken
      );
      console.log("🚀 ~ file: Blog.jsx:49 ~ postMessage ~ jwtToken:", jwtToken);

      console.log("Message posted successfully");
      setInputMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const deletePost = async (messageId) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      deleteMessage(messageId, jwtToken)
        .then(() => {
          fetchMessages();
        })
        .catch((error) => {
          console.error("Error deleting message:", error);
        });
    }
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row w-full p-5 md:mt-0 mt-10 ">
      <div className="md:w-1/3 mb-5">
        <div className="">
          <textarea
            className="textarea textarea-info w-full focus:border-slate-300"
            rows="4"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Type your message here..."
          ></textarea>
          <button className="btn btn-primary w-full" onClick={postMessage}>
            Post Comment
          </button>
        </div>
      </div>
      <div className="md:w-2/3">
        {messages.map((message, index) => (
          <div
            key={message._id || index}
            className="card w-full bg-info shadow-xl mb-5 md:ml-5"
          >
            <div className="card-body">
              <h2 className="">
                Posted on{" "}
                {dayjs(message.postDate)
                  .tz("Australia/Brisbane")
                  .format("H:mm A - DD/MM/YY")}{" "}
                by {message.name}
              </h2>

              <p className="card-title">{message.comment}</p>

              <div className="card-actions justify-end"></div>
              {authenticatedUser && authenticatedUser.role === "Admin" && (
                <button
                  className="btn btn-accent w-30 place-self-end"
                  onClick={() => deletePost(message.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageBoard;
