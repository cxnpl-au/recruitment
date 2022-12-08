// Shows list of all users in a business so their permissions can be easily updated
// User must be signed in and have the "admin" role to view this page

import React, { useState } from "react";

// Import bootstrap components
import { Tab, Modal, Button } from "react-bootstrap";

// Import components
import CreateUserForm from "../components/CreateUserForm";
import TeamList from "../components/TeamList";

const Admin = () => {
  // Set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <main>
      {/* Page title */}
      <div className="d-flex align-items-center mb-3">
        <h2>Team</h2>
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
