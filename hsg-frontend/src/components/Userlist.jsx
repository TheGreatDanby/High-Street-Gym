import { useEffect, useState } from "react";

import { getAllUsers } from "../api/users";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then((getUsersResponse) => {
      setUsers(getUsersResponse);
    });
  }, []);

  return (
    <>
      <div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Favorite Color</th>
              </tr>
            </thead>
            <tbody>
              {users.map((usersObj) => (
                <tr key={users._id}>
                  <td className="hidden">{users.id}</td>
                  <td>{users.firstName}</td>
                  <td>{users.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default UserList;
