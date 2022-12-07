// If someone enters an incorrect URL, let them know
import React from "react";

// Import `useLocation()` to retrieve the current `location` object data from React Router
import { useLocation } from "react-router-dom";

// Import Link component for all internal application hyperlinks
import { Link } from "react-router-dom";

const NotFound = () => {
  let location = useLocation();

  return (
    <main className="d-flex justify-content-between align-items-top">
      <div>
        <h2>Oops!</h2>
        <p>
          There doesn't appear to be a page for <b>{location.pathname}</b>.
        </p>
        <Link className="btn" variant="success" to={`/`}>
          Go back to home page
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
