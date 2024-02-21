import React, { useEffect, useState } from "react";
import { useAuthentication } from "../hooks/authentication";

import {
  getAllUsers,
  getUserByID,
  updateUser,
  createUser,
  deleteUser,
} from "../api/users.js";

import { XMLUploadUsers } from "../components/XMLUploadUsers";
import Swal from "sweetalert2";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    authenticatedUser: user,
    jwtToken,
    authenticatedUser,
  } = useAuthentication();

  const fetchUsers = async () => {
    let fetchedUsers = [];
    switch (authenticatedUser?.role) {
      case "Admin":
        fetchedUsers = await getAllUsers(jwtToken);
        break;
      case "Trainer":
        fetchedUsers = await getAllUsers(jwtToken);
        fetchedUsers = fetchedUsers.filter(
          (user) => user.role === "Member" || user.id === authenticatedUser.id
        );
        break;
      case "Member":
        const user = await getUserByID(authenticatedUser.id, jwtToken);
        fetchedUsers = [user];
        break;
      default:
        console.log("No valid role found or user not authenticated");
    }
    setUsers(fetchedUsers);
  };

  const [selectedUsersID, setSelectedUsersID] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const groupBy = (array, key) => {
    return array.reduce((result, currentItem) => {
      (result[currentItem[key]] = result[currentItem[key]] || []).push(
        currentItem
      );
      return result;
    }, {});
  };
  const usersByRoles = groupBy(users, "role");

  const rolesOrder = ["Admin", "Trainer", "Member"];

  const getRoleColorClass = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-600";
      case "Trainer":
        return "bg-green-600";
      case "Member":
        return "bg-blue-600";
      default:
        return "text-black";
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers().finally(() => setLoading(false));
  }, [authenticatedUser]);

  useEffect(() => {
    if (selectedUsersID) {
      getUserByID(selectedUsersID, jwtToken).then((user) => {
        setSelectedUsers(user);
      });
    } else {
      setSelectedUsers({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        password: "",
      });
    }
  }, [selectedUsersID]);

  function clearUsersForm() {
    setSelectedUsersID(null);
    setSelectedUsers({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      password: "",
    });
  }
  const handleUsersPostUpdate = fetchUsers;

  function createOrUpdateSelectedUsers() {
    if (selectedUsersID) {
      // Update
      updateUser(selectedUsers, jwtToken).then(() => {
        handleUsersPostUpdate();
        setSelectedUsersID(null);
        setSelectedUsers({
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          role: "",
          password: "",
        });
      });
    } else {
      // Create
      createUser(selectedUsers, jwtToken).then((userDetails) => {
        handleUsersPostUpdate();
        setSelectedUsersID(userDetails.id);
      });
    }
  }

  async function deleteSelectedUser(userId) {
    console.log(
      "🚀 ~ file: Users.jsx:279 ~ deleteSelectedUser ~ userId:",
      userId
    );
    const result = await Swal.fire({
      title: "Are you sure you want to delete this User?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      deleteUser(userId, jwtToken).then((result) => {
        handleUsersPostUpdate();

        setSelectedUsersID(null);
        setSelectedUsers({
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          role: "",
          password: "",
        });
      });
    }
  }

  return (
    <>
      {loading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <div>
          <div className="container mx-auto grid md:grid-cols-2 grid-cols-1 gap-2 mt-10 md:mt-0">
            <div className="overflow-x-auto overflow-scroll row-start-2 md:row-auto ">
              <table className="table-auto w-full ">
                <thead>
                  <tr>
                    <th className="hidden sticky top-0">ID</th>
                    <th className="text-xs sm:text-sm">First Name</th>
                    <th className="sticky sm:text-sm top-0 hidden md:table-cell">
                      Last Name
                    </th>
                    <th className="text-xs sm:text-sm">Email</th>
                    <th className="sm:text-sm w-1/4">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {rolesOrder.map(
                    (role) =>
                      usersByRoles[role] &&
                      usersByRoles[role].length > 0 && (
                        <React.Fragment key={role}>
                          <tr className="bg-gray-200">
                            <td
                              colSpan="5"
                              className={`text-center text-black font-bold ${getRoleColorClass(
                                role
                              )}`}
                            >
                              {role}
                            </td>
                          </tr>
                          {usersByRoles[role] &&
                            usersByRoles[role].map((user) => (
                              <tr key={user.id}>
                                <td className="hidden">{user.id}</td>
                                <td className="truncate">{user.firstName}</td>
                                <td className="hidden md:table-cell">
                                  {user.lastName}
                                </td>
                                <td className="truncate">{user.email}</td>
                                <td className="whitespace-nowrap p-1 flex justify-center ">
                                  <button
                                    className="btn btn-xs btn-warning px-2 "
                                    onClick={() => setSelectedUsersID(user.id)}
                                  >
                                    Select
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </React.Fragment>
                      )
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-2 ">
              <div className="form-control w-full p-2">
                <label htmlFor="first-name" className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  id="first-name"
                  placeholder="Arnold"
                  className="input input-bordered w-full"
                  value={selectedUsers.firstName}
                  onChange={(e) =>
                    setSelectedUsers({
                      ...selectedUsers,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name:</span>
                </label>
                <input
                  type="text"
                  placeholder="Schwarzenegger"
                  className="input input-bordered"
                  value={selectedUsers.lastName}
                  onChange={(e) =>
                    setSelectedUsers({
                      ...selectedUsers,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email:</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="example@company.com"
                  value={selectedUsers.email}
                  onChange={(e) =>
                    setSelectedUsers({
                      ...selectedUsers,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                {authenticatedUser.role !== "Member" && (
                  <div>
                    <label
                      // for="department"
                      htmlFor="role"
                      className="text-sm font-medium text-white-900 block mb-2"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      className="select shadow-sm bg-gray-50 border border-gray-300 text-white-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 text-black	 "
                      value={selectedUsers.role}
                      onChange={(e) =>
                        setSelectedUsers({
                          ...selectedUsers,
                          role: e.target.value,
                        })
                      }
                    >
                      <option>Please Select</option>

                      <option>Member</option>
                      {authenticatedUser.role === "Admin" && (
                        <>
                          <option>Trainer</option>
                          <option>Admin</option>
                        </>
                      )}
                    </select>
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="new-password"
                  className="text-sm font-medium text-white-900 block mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="new-password"
                  id="new-password"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-white-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 mb-5"
                  placeholder="••••••••"
                  required
                  value={selectedUsers.password || ""}
                  onChange={(e) =>
                    setSelectedUsers({
                      ...selectedUsers,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-around gap-2">
                <button
                  className="btn btn-secondary rounded-md w-1/3"
                  onClick={() => createOrUpdateSelectedUsers()}
                >
                  Save
                </button>
                {authenticatedUser.role !== "Member" && (
                  <>
                    <button
                      className="btn btn-primary rounded-md w-1/3"
                      onClick={() => clearUsersForm()}
                    >
                      New
                    </button>
                    {authenticatedUser.role !== "Trainer" && (
                      <button
                        className="btn btn-accent rounded-md w-1/3"
                        onClick={() => {
                          console.log(
                            "Delete button clicked for user ID:",
                            selectedUsers.id
                          );
                          deleteSelectedUser(selectedUsers.id);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            {authenticatedUser.role === "Admin" && (
              <div className="rounded border-2 border-primary  min-h-16 p-2 justify-center col-span-2 ">
                <h2 className="text-center uppercase font-black	text-lg">
                  Upload Users
                </h2>
                <XMLUploadUsers
                  onUploadSuccess={() => {
                    getAllUsers(jwtToken).then((users) => setUsers(users));
                  }}
                />
              </div>
            )}
          </div>{" "}
        </div>
      )}
    </>
  );
}
