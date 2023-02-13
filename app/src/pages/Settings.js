import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import useAuth from "../services/useAuth";
import axiosConfig from "../services/axiosConfig";

export default function Settings() {
  const auth = useAuth();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    console.log(auth);
    async function getCurrentUser() {
      axiosConfig
        .get(`/users/${auth.user}`, {
          headers: { Authorization: "Bearer " + auth.token },
        })
        .then((res) => {
          setCurrentUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getCurrentUser();
  }, [auth, auth.user, auth.token]);

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div class="w-full">
      <Header />
      <div class=" mx-5 my-5">
        <h5 class="font-medium leading-tight text-xl mt-0 mb-2">Settings</h5>
        <div class="px-5 py-5 space-y-2">
          <div class="font-bold">Name</div>
          <div>{currentUser?.name ?? ""}</div>
          <div class="font-bold">Email</div>
          <div>{currentUser?.email ?? ""}</div>
          <div class="font-bold">Organisation</div>
          <div>{currentUser?.organisation ?? ""}</div>
          <div class="font-bold">Role</div>
          <div>{currentUser?.role ?? ""}</div>
          <button
            onClick={handleLogout}
            type="button"
            class="ml-auto transition duration-200 bg-red-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-center inline-block"
          >
            <span class="inline-block mx-3">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
