import React from "react";
import { useState, useEffect } from "react";
// import SignOutButton from "../components/SignOutButton";
import axiosConfig from "../services/axiosConfig";
// import { Link } from "react-router-dom";
import UserCard from "../components/UserCard";
import Header from "../components/Header";
import useAuth from "../services/useAuth";
import { useNavigate } from "react-router";
import UserTable from "../components/UserTable";

export default function Users() {
  const navigate = useNavigate();

  const [userList, setuserList] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const auth = useAuth();

  // fetch user accounts from database
  // check whether admin
  useEffect(() => {
    setLoading(true);
    axiosConfig
      .get(`/users`, {
        headers: { Authorization: "Bearer " + auth.token },
      })
      .then((result) => {
        console.log(result);
        setuserList(result.data);
        setLoading(false);
        setError(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setError(true);
      });
  }, [auth.token, auth]);

  return (
    <div class="w-full">
      <Header />
      {isLoading ? (
        <div class="flex items-center justify-center">
          <div
            class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <span class="visually-hidden"></span>
          </div>
        </div>
      ) : (
        // todo check permissions/team
        <div class="sm:container mx-auto">
          <div>Your team</div>
          {userList?.length > 0 ? (
            <UserTable users={userList} />
          ) : (
            // <div class="grid gap-4 grid-cols-3">
            //   {userList.map((user) => {
            //     return <UserCard user={user} />;
            //   })}
            // </div>
            "No users found."
          )}
        </div>
      )}
    </div>
  );
}
