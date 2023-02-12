import React from "react";

export default function UserCard(props) {
  const user = props.user;

  return (
    <div class="flex mr-auto justify-center">
      <div class="rounded-lg shadow-lg bg-white max-w-sm">
        <span>
          <img
            src="https://mdbcdn.b-cdn.net/img/new/avatars/8.webp"
            class="rounded-full w-20 my-4 mx-auto"
            alt="Avatar"
          />
          <p class="text-gray-900 text-xl font-medium mb-2">{user.name}</p>
        </span>

        <div class="p-6">
          {/* <p class="text-gray-700 text-base mb-4">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p> */}
          <div>{user.role}</div>
          <button
            type="button"
            class=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Button
          </button>
        </div>
      </div>
    </div>
  );
}
