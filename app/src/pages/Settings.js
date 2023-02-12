import React from "react";
import Header from "../components/Header";
import useAuth from "../services/useAuth";

export default function Settings() {
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div>
      <Header />
      <span>Settings</span>
      <div class="px-5 py-5 space-y-2">
        <button
          onClick={handleLogout}
          type="button"
          class="ml-auto transition duration-200 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full font-semibold text-center inline-block"
        >
          <span class="inline-block mx-3">Logout</span>
        </button>
      </div>
    </div>
  );
}
