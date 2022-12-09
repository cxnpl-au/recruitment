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
      <p>Explanation</p>
      <br></br>
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
