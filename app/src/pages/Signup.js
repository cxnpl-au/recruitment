import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import axiosConfig from "../services/axiosConfig";
import useAuth from "../services/useAuth";
import { Link } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [organisation, setOrganisation] = useState(null);

  const auth = useAuth();

  //   signup
  const handleSignup = (e) => {
    e.preventDefault();
    auth.signup(role, name, email, password, organisation);
    navigate("/users");
  };

  // potentially update to "create new user instead of letting users just sign up"
  return (
    <div>
      <div class="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <h1 class="font-bold text-center text-2xl mb-5">Identity Manager</h1>
          <div class="bg-white shadow w-full space-y-2 rounded-lg divide-y divide-solid">
            <div class="px-5 py-5">
              <label class="font-semibold text-gray-600 block">Role</label>
              <select
                onChange={(e) => setRole(e.target.value)}
                class="block appearance-none w-full border border-gray-200 text-gray-700 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
              >
                {/* only visible if user is also admin */}
                <option selected>Select one</option>
                <option value="Admin">Admin</option>
                <option value="Contributor">Contributor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <label class="font-semibold text-gray-600 block">Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                class="border border-gray-200 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label class="font-semibold text-gray-600 block">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                class="border border-gray-200 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label class="font-semibold text-gray-600 block">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                class="border border-gray-200 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label class="font-semibold text-gray-600 block">
                Re-enter Password
              </label>
              <input
                type="password"
                class="border border-gray-200 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label class="font-semibold text-gray-600 block">Organisation</label>
              <div class="text-xs text-gray-500">Join your existing organisation or enter a new name to create an new organisation.</div>
              <input
                onChange={(e) => setOrganisation(e.target.value)}
                type="text"
                class="border border-gray-200 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <button
                onClick={(e) => handleSignup(e)}
                type="button"
                class="ml-auto transition duration-200 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full font-semibold text-center inline-block"
              >
                <span class="inline-block mx-3">Signup</span>
              </button>
            </div>
            <div class="px-5 py-5 space-y-2">
              <span class="font-semibold text-gray-600 mb-3 mr-1 text-center">
                Already have an account?
              </span>
              <Link to="/" class="underline text-blue-600">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
