// Shows all accounts created under a business
// Admins can view all accounts, edit all accounts, create new accounts and delete accounts
// Editors can view all accounts, edit all accounts
// Viewers can view all accounts
// User must be signed in to view this page

import React, { useState } from "react";

// Import bootstrap components
import { Tab, Modal, Button } from "react-bootstrap";

// Import components
import CreateAccountForm from "../components/CreateAccountForm";
import AccountList from "../components/AccountList";

// Import authentication token function
import Auth from "../utils/auth";

const Dashboard = () => {
  // Set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <main>
      {/* Page title */}
      <div className="d-flex align-items-center mb-3">
        <h2>Accounts</h2>
        {Auth.isAdmin() ? (
          <Button className="btn btn-link" onClick={() => setShowModal(true)}>
            +
          </Button>
        ) : (
          " "
        )}
      </div>
      {/* List of accounts */}
      <AccountList />
      {/* Modal to create new account */}
      <Modal
        centered
        className="d-flex justify-content-center"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="create-account-modal">
        <Tab.Container>
          <Modal.Header closeButton>
            <h3>Create an account</h3>
          </Modal.Header>
          <Modal.Body>
            <CreateAccountForm handleModalClose={() => setShowModal(false)} />
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </main>
  );
};

export default Dashboard;
