// Landing page
// Anyone can see this page

import React from "react";

// Import Link component for all internal application hyperlinks
import { Link } from "react-router-dom";

// Import authentication token function
import Auth from "../utils/auth";

const Home = () => {
  return (
    <main className="d-flex flex-column align-items-center">
      <h2>Title</h2>
      <p>Explanation</p>
      {Auth.loggedIn() ? (
        <></>
      ) : (
        <div className="d-flex justify-content-between">
          <Link className="btn mx-3" to={`/getstarted`}>
            Create a new business account
          </Link>
          <Link className="btn mx-3" to={`/login`}>
            Log in to an existing business
          </Link>
        </div>
      )}
    </main>
  );
};

export default Home;
