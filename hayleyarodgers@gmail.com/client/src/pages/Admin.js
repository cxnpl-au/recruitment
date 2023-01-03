// Shows list of all users in a business so their permissions can be easily updated
// User must be signed in and have the "admin" role to view this page

import React, { useState } from "react";

// Import bootstrap components
import { Tab, Modal, Button } from "react-bootstrap";

// Import components
import CreateUserForm from "../components/CreateUserForm";
import TeamList from "../components/TeamList";

// Import Link component for all internal application hyperlinks
import { Link } from "react-router-dom";

// Import authentication token function
import Auth from "../utils/auth";

const Admin = () => {
  // Set modal display state
  const [showModal, setShowModal] = useState(false);

  // If user isn't logged in and stumbles across url, don't render page
  if (!Auth.loggedIn()) {
    return (
      <main className="d-flex justify-content-between align-items-top">
        <div>
          <h2>Oops!</h2>
          <p>You need to log in to view this page.</p>
          <Link className="btn" variant="success" to={`/login`}>
            Go to log in page
          </Link>
        </div>
      </main>
    );
  }

  // If user isn't an admin and stumbles across url, don't render page
  if (!Auth.isAdmin()) {
    return (
      <main className="d-flex justify-content-between align-items-top">
        <div>
          <h2>Oops!</h2>
          <p>You don't have the permissions to view this page.</p>
          <Link className="btn" variant="success" to={`/dashboard`}>
            Go to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Page title */}
      <div className="d-flex align-items-center mb-3">
        <h2 className="marginless">Team</h2>
        <Button className="btn btn-link" onClick={() => setShowModal(true)}>
          +
        </Button>
      </div>
      {/* List of users in business */}
      <TeamList />
      {/* Modal to create new user */}
      <Modal
        centered
        className="d-flex justify-content-center"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="create-user-modal">
        <Tab.Container>
          <Modal.Header closeButton>
            <h3>Create a new user</h3>
          </Modal.Header>
          <Modal.Body>
            <CreateUserForm handleModalClose={() => setShowModal(false)} />
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </main>
  );
};

export default Admin;
