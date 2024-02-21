import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  createClasses,
  deleteClasses,
  getAllClasses,
  getClassesByID,
  updateClasses,
  updateSession,
  createSession,
  getSessionByID,
  deleteSession,
  getAllSessions,
  getSessionsByClassID,
} from "../api/classes";
import { XMLUpload } from "../components/XMLUpload";
import Swal from "sweetalert2";
import { useAuthentication } from "../hooks/authentication";

export default function ClassesCRUD() {
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedClassesID, setSelectedClassesID] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState({
    _id: "",
    Name: "",
    Description: "",
    Duration: "",
    Timeslot: "",
    Location: "",
  });
  console.log("Initial Timeslot:", selectedClasses);

  const [selectedSession, setSelectedSession] = useState({
    sessionDate: "",
    Trainer: "",
  });
  const [selectedSessionID, setSelectedSessionID] = useState(null);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [loading, setLoading] = useState(true);
  const {
    authenticatedUser: user,
    jwtToken,
    authenticatedUser,
  } = useAuthentication();

  useEffect(() => {
    if (selectedClassesID) {
      getSessionsByClassID(selectedClassesID, jwtToken)
        .then((sessions) => {
          setSessions(sessions);
        })
        .catch((error) => {
          console.error("Failed to get sessions by class ID:", error);
        });

      getClassesByID(selectedClassesID, jwtToken).then((classesObj) => {
        setSelectedClasses(classesObj);
      });
    } else {
      setSelectedClasses({
        _id: "",
        Name: "",
        Description: "",
        Duration: "",
        Timeslot: "",
        Location: "",
      });
    }
    {
      setLoading(false);
    }

    getAllClasses(jwtToken).then((classes) => {
      setClasses(classes);
    });
  }, [selectedClassesID]);

  useEffect(() => {
    if (selectedSessionID) {
      getSessionByID(selectedSessionID, jwtToken)
        .then((session) => {
          setSelectedSession(session);
        })
        .catch((error) => {
          console.error("Failed to get sessions by class ID:", error);
        });
    }
  }, [selectedSessionID]);

  function clearClassesForm() {
    setSelectedClassesID(null);
    setSelectedClasses({
      id: "",
      Name: "",
      Description: "",
      Duration: "",
      Timeslot: "",
      Location: "",
    });
  }
  function clearSessionForm() {
    setSelectedSessionID(null);
    setSelectedSession({
      id: "",
      sessionDate: "",
      Trainer: "",
    });
  }

  function createOrUpdateSelectedClasses() {
    console.log("Before update/create Timeslot:", selectedClasses.Timeslot);

    if (selectedClassesID) {
      // Update
      updateClasses(selectedClasses, jwtToken).then((updatedClasses) => {
        setSelectedClassesID(null);
        setSelectedClasses({
          _id: "",
          Name: "",
          Description: "",
          Duration: "",
          Timeslot: "",
          Location: "",
        });
      });
    } else {
      // Create
      createClasses(
        {
          id: "",
          Name: selectedClasses.Name,
          Description: selectedClasses.Description,
          Duration: selectedClasses.Duration,
          Timeslot: selectedClasses.Timeslot,
          Location: selectedClasses.Location,
        },
        jwtToken
      )
        .then((classesDetails) => {
          getAllClasses(jwtToken).then((classes) => {
            setClasses(classes);
          });
          setSelectedClasses({
            id: "",
            Name: "",
            Description: "",
            Duration: "",
            Timeslot: "",
            Location: "",
          });
          console.log("After API response Timeslot:", selectedClasses);
        })
        .catch((error) => {
          console.error("Error in createClasses:", error);
        });
    }
  }

  function createOrUpdateSelectedSession() {
    if (selectedSessionID) {
      // Update
      updateSession(selectedSession, jwtToken).then((updatedSession) => {
        getSessionsByClassID(selectedClassesID, jwtToken).then((sessions) => {
          setSessions(sessions);
        });

        setSelectedSessionID(null);
        setSelectedSession({
          id: "",
          sessionDate: "",
          Trainer: "",
        });
      });
    } else {
      // Create
      console.log(selectedSession);

      createSession(
        {
          classSessionId: selectedClassesID,
          sessionDate: selectedSession.sessionDate,
          participants: selectedSession.participants,
          Trainer: selectedSession.Trainer,
        },
        jwtToken
      )
        .then((SessionDetails) => {
          console.log("selectedClassesID", selectedClassesID);

          getSessionsByClassID(selectedClassesID, jwtToken).then((sessions) =>
            setSessions(sessions)
          );
        })
        .catch((error) => {
          console.error("Error in create Session:", error);
        });
    }
  }

  async function deleteSelectedClasses(classID) {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this Class?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      deleteClasses(classID, jwtToken).then((result) => {
        setSelectedClassesID(null);
        setSelectedClasses({
          // id: "",
          Name: "",
          Description: "",
          Duration: "",
          Timeslot: "",
          Location: "",
        });
      });
    }
  }

  async function deleteSelectedSession(sessionID) {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this Session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      deleteSession(sessionID, jwtToken).then((result) => {
        getSessionsByClassID(selectedClassesID, jwtToken).then((sessions) => {
          setSessions(sessions);
        });
        setSelectedSessionID(null);
        setSelectedSession({
          id: "",
          sessionDate: "",
          Trainer: "",
        });
      });
    }
  }

  return (
    <div className="container mx-auto grid md:grid-cols-2 grid-cols-1 gap-2 mt-10 md:mt-0">
      {/* Classes list */}
      <div className="overflow-x-auto overflow-scroll row-start-2 md:row-auto ">
        {loading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <>
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th className="hidden sticky top-0 bg-primary">ID</th>
                  <th className="sticky top-0 left-0 bg-primary rounded-l ">
                    {/* Edit */}
                  </th>
                  <th className="sticky top-0 bg-primary rounded-r md:rounded-r-none">
                    Name
                  </th>
                  <th className="sticky top-0 bg-primary hidden md:table-cell">
                    Duration
                  </th>
                  <th className="sticky top-0 bg-primary hidden md:table-cell">
                    Timeslot
                  </th>
                  <th className="sticky top-0 bg-primary hidden md:table-cell rounded-r">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {classes ? (
                  classes.map((classObj) => {
                    return (
                      <tr key={classObj._id}>
                        <td>
                          <button
                            className="btn btn-xs btn-warning rounded"
                            onClick={() => {
                              console.log("Clicked!");
                              console.log(classObj._id);
                              setSelectedClassesID(classObj._id);
                              setSelectedClassName(classObj.Name);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                        <td>{classObj.Name}</td>
                        <td className="hidden md:table-cell">
                          {classObj.Duration + " Min."}
                        </td>
                        <td className="hidden md:table-cell">
                          {classObj.Timeslot}
                        </td>
                        <td className="hidden md:table-cell">
                          {classObj.Location}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9">Loading...</td>{" "}
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      <div className="p-2 ">
        <div className="form-control ">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Class Name"
            className="input input-bordered"
            value={selectedClasses.Name}
            onChange={(e) =>
              setSelectedClasses({
                ...selectedClasses,
                Name: e.target.value,
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <input
            type="text"
            placeholder="Class Description"
            className="input input-bordered"
            value={selectedClasses.Description}
            onChange={(e) =>
              setSelectedClasses({
                ...selectedClasses,
                Description: e.target.value,
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Duration</span>
          </label>
          <input
            type="number"
            placeholder="Class Duration"
            className="input input-bordered"
            value={selectedClasses.Duration}
            onChange={(e) =>
              setSelectedClasses({
                ...selectedClasses,
                Duration: e.target.value,
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Timeslot</span>
          </label>
          <input
            type="text"
            placeholder="Class Timeslot"
            className="input input-bordered"
            value={selectedClasses.Timeslot}
            onChange={(e) =>
              setSelectedClasses({
                ...selectedClasses,
                Timeslot: e.target.value,
              })
            }
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            type="text"
            placeholder="Class Building"
            className="input input-bordered"
            value={selectedClasses.Location}
            onChange={(e) =>
              setSelectedClasses({
                ...selectedClasses,
                Location: e.target.value,
              })
            }
          />
        </div>
        <div className="flex justify-around gap-2 pt-5">
          <button
            className="btn btn-secondary rounded-md w-1/3"
            onClick={() => createOrUpdateSelectedClasses()}
          >
            Save
          </button>{" "}
          <button
            className="btn btn-primary rounded-md w-1/3"
            onClick={() => clearClassesForm()}
          >
            New
          </button>{" "}
          <button
            className="btn btn-accent rounded-md w-1/3"
            onClick={() => deleteSelectedClasses(selectedClassesID)}
          >
            Delete
          </button>{" "}
        </div>
      </div>
      <div className="rounded border-2 border-primary  min-h-16 p-2 justify-center col-span-2 ">
        <h2 className="text-center uppercase font-black	text-lg ">
          Upload Classes
        </h2>
        <XMLUpload
          onUploadSuccess={() => {
            getAllClasses().then((classes) => setClasses(classes));
          }}
        />
      </div>

      <div>
        <h2 className=" font-bold	text-2xl md:text-3xl	text-center	p-3 bg-info rounded mb-2 row-start-4 md:row-auto">
          Available Session for {selectedClassName}
        </h2>

        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th className="hidden sticky top-0 bg-primary">ID</th>
              <th className="sticky top-0 left-0 bg-primary rounded-l">
                {/* Edit */}
              </th>
              <th className="sticky top-0 bg-primary">Date</th>
              <th className="sticky top-0 bg-primary">Trainer</th>
              <th className="sticky top-0 bg-primary rounded-r">
                Participants
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions ? (
              sessions.map((sessionsObj) => {
                return (
                  <tr key={sessionsObj._id}>
                    <td>
                      <button
                        className="btn btn-xs btn-warning rounded"
                        onClick={() => {
                          setSelectedSessionID(sessionsObj._id);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                    <td>{dayjs(sessionsObj.sessionDate).format("DD/MM/YY")}</td>
                    <td>{sessionsObj.Trainer}</td>
                    <td>
                      <select>
                        <option defaultValue disabled>
                          {sessionsObj.participants
                            ? sessionsObj.participants.length
                            : 0}{" "}
                          Bookings
                        </option>
                        {sessionsObj.participants.map((participant, index) => (
                          <option key={index} value={participant.name}>
                            {participant.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="font-bold	text-3xl	text-center	pt-10" colSpan="9">
                  No sessions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-2 row-start-5 md:row-auto ">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={
              selectedSession.sessionDate
                ? dayjs(selectedSession.sessionDate).format("YYYY-MM-DD")
                : ""
            }
            onChange={(e) => {
              const newDate = e.target.value
                ? dayjs(e.target.value, "YYYY-MM-DD").format("YYYY-MM-DD")
                : "";
              setSelectedSession({
                ...selectedSession,
                sessionDate: newDate,
              });
            }}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Trainer</span>
          </label>
          <input
            type="text"
            placeholder="Session Trainer"
            className="input input-bordered"
            value={selectedSession.Trainer}
            onChange={(e) =>
              setSelectedSession({
                ...selectedSession,
                Trainer: e.target.value,
              })
            }
          />
        </div>

        <div className="flex justify-around gap-2 pt-5">
          <button
            className="btn btn-secondary rounded-md w-1/3"
            onClick={() => createOrUpdateSelectedSession()}
          >
            Save
          </button>{" "}
          <button
            className="btn btn-primary rounded-md w-1/3"
            onClick={() => clearSessionForm()}
          >
            New
          </button>{" "}
          <button
            className="btn btn-accent rounded-md w-1/3"
            onClick={() => deleteSelectedSession(selectedSessionID)}
          >
            Delete
          </button>{" "}
        </div>
      </div>
    </div>
  );
}
