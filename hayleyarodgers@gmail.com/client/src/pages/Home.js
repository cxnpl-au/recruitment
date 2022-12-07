// Landing page
// Anyone can see this page

import React, { useState } from "react";

// Import Link component for all internal application hyperlinks
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="d-flex flex-column align-items-center">
      <h1>Title</h1>
      <p>Explanation</p>
      <div className="d-flex justify-content-between">
        <Link className="btn mx-3" to={`/signup`}>
          Create a new business account
        </Link>
        <Link className="btn mx-3" to={`/login`}>
          Log in to an existing business
        </Link>
      </div>
    </main>
  );
};

export default Home;
