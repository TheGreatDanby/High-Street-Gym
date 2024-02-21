import React from "react";
import dayjs from "dayjs";
import { createBooking } from "../api/classes";
import { useAuthentication } from "../hooks/authentication";

function handleClick(sessionId) {
  createBooking(classObj._id, sessionId)
    .then((updatedParticipants) => {
      onBookingUpdate(sessionId, updatedParticipants);
    })
    .catch((error) => {
      console.error("Error booking class:", error);
    });
}

function Sessions({ classObj, onBookingUpdate }) {
  if (!classObj) {
    return <div>Loading...</div>;
  }

  function sessionBooking(classSessionId, sessionDate, classObj) {
    const participant = {
      userId: "333fcbf0bd6ead74ed118090",
      name: "John Doe",
    };

    createBooking(classSessionId, sessionDate, participant)
      .then((booking) => {
        console.log(`created booking`, booking);
        onBookingUpdate(classObj, booking);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <p>Upcoming Sessions:</p>
      {classObj.bookings.bookings.map((sessionObj, index) => {
        return (
          <div
            key={`${sessionObj.classSessionId}-${index}`}
            id={sessionObj.classSessionId}
            className="sessions"
          >
            <div>
              <p className="mt-5">
                {dayjs(sessionObj.sessionDate).format("DD/MM/YY")}
              </p>
              <p>{sessionObj.participants.length} have booked</p>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  sessionBooking(
                    sessionObj.classSessionId,
                    sessionObj.sessionDate,
                    classObj
                  );
                }}
              >
                Book Class
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Sessions;
