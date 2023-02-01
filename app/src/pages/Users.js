import React from "react";
import { useState, useEffect } from "react";
// import { useAuth } from "../services/useAuth";
// import SignOutButton from "../components/SignOutButton";
import axiosConfig from "../services/axiosConfig";
// import { Link, useHistory } from "react-router-dom";

const Users = () => {
  let [userList, setuserList] = useState(null);

  // fetch user accounts from database
  // check whether admin
  useEffect(() => {
    axiosConfig
      .get(`/users`, {
      })
      .then((result) => {
        console.log("GET users");
        console.log(result);
        setuserList(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userList]);

  console.log(userList);

  return (
    <div>
      {userList?.length > 0 ? (
        <div>
          {userList.map((user) => {
            return (
              <div>
                <div>name: {user.name}</div>
                <div>role: {user.role}</div>
              </div>
            );
          })}
        </div>
      ) : (
        "No users found."
      )}
    </div>
  );
};

export default Users;
