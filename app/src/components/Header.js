import React from "react";
import "../App.css";
import "../index.css";

export default function Header(props) {
  return (
    <header>
      <nav class="navbar navbar-expand-lg shadow-md py-2 bg-white relative flex items-center w-full justify-between">
        <div class="px-6 w-full flex flex-wrap items-center justify-between">
          <div>
            <ul class="navbar-nav mr-auto lg:flex lg:flex-row">
              <li class="nav-item">
                <span class="nav-link block pr-2 lg:px-2 py-2 text-gray-600 hover:text-gray-700 focus:text-gray-700 font-bold">
                  Identity Manager
                </span>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link block pr-2 lg:px-2 py-2 text-gray-600 hover:text-gray-700 focus:text-gray-700"
                  href="/"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                >
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link block pr-2 lg:px-2 py-2 text-gray-600 hover:text-gray-700 focus:text-gray-700"
                  href="/settings"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                >
                  Settings
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
