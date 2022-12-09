// Landing page
// Anyone can see this page

import React from "react";

// Import bootstrap components
import { Row, Card } from "react-bootstrap";

// Import Link component for all internal application hyperlinks
import { Link } from "react-router-dom";

// Import authentication token function
import Auth from "../utils/auth";

const Home = () => {
  return (
    <main>
      <h2>Identity Management (IM) Service</h2>
      <h3>Description</h3>
      <p>
        My goal for this project was to build an identity management (IM) system
        and API to manage users and their permissions. This application achieves
        this by allowing a user to log in to their business and CRUD its
        accounts and users (depending on whether they are an "admin", "editor"
        or "viewer" as determined by an admin).
      </p>
      <p>
        {" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/cxnpl-au/recruitment/tree/submission/hayleyarodgers%40gmail.com/hayleyarodgers%40gmail.com">
          To read more about this application and how it works, see here.
        </a>
      </p>
      <br></br>
      {/* If user is already logged in, don't show them log in and sign up options */}
      {Auth.loggedIn() ? (
        <></>
      ) : (
        <Row xs={1} md={2} className="g-4">
          <Link to={`/getstarted`}>
            <Card className="card home border-0 h-100 p-3 text-center">
              <Card.Body>
                <Card.Title>
                  <h3>New business</h3>
                </Card.Title>
                <Card.Text>Sign up to create a new business.</Card.Text>
              </Card.Body>
            </Card>
          </Link>
          <Link to={`/login`}>
            <Card className="card home border-0 h-100 p-3 text-center">
              <Card.Body>
                <Card.Title>
                  <h3>Existing business</h3>
                </Card.Title>
                <Card.Text>Log in to an existing business.</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Row>
      )}
    </main>
  );
};

export default Home;
