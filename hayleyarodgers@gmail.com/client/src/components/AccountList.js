import React, { useState, useEffect } from "react";

// Import bootstrap components
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Modal,
  Alert,
  Form,
  Button,
} from "react-bootstrap";

// Import API call, authentication token and saving user role to local storage functions
import {
  getBusiness,
  getAccount,
  updateAccount,
  deleteAccount,
} from "../utils/API";
import Auth from "../utils/auth";
import { getSavedBusinessId } from "../utils/localStorage";

const AccountList = () => {
  // Set update account modal display state
  const [showModal, setShowModal] = useState(false);

  // Set state for account data
  const [accountFormData, setAccountFormData] = useState({});

  // Set state for form validation
  const [validated] = useState(false);

  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // Set state for account id
  const [accountIdData, setAccountIdData] = useState("");

  // Set initial state
  const [businessData, setBusinessData] = useState({});

  // Use to determine if `useEffect()` hook needs to run again
  const businessDataLength = Object.keys(businessData).length;

  // Get business data, including its accounts
  useEffect(() => {
    const getBusinessData = async () => {
      // Check token before proceeding
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        return false;
      }

      // Get business id saved in local storage
      const businessId = getSavedBusinessId();

      // Since getBusiness is asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
      try {
        const response = await getBusiness(businessId, token);

        if (!response.ok) {
          throw new Error(
            "Something went wrong while getting business information."
          );
        }

        const business = await response.json();
        setBusinessData(business);
      } catch (err) {
        console.error(err);
      }
    };

    getBusinessData();
  }, [businessDataLength]);

  // If data isn't here yet, say so
  if (!businessDataLength) {
    return <h2>Loading...</h2>;
  }

  // Show update modal
  const handleShowModal = async (businessId, accountId) => {
    // Check token before proceeding
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    // Get data to prefill modal
    const response = await getAccount(businessId, accountId, token);

    if (!response.ok) {
      throw new Error("Something went wrong getting account data.");
    }

    const account = await response.json();
    setAccountFormData(account);
    setAccountIdData(accountId);

    // Show modal
    setShowModal(true);
  };

  // When the input of any form field changes, set form data
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAccountFormData({ ...accountFormData, [name]: value });
  };

  // Update account
  const handleUpdateFormSubmit = async (event) => {
    // Stop page refresh
    event.preventDefault();

    // Check token before proceeding
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    // Check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Since updateAccount is asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
    try {
      const businessId = getSavedBusinessId();
      const accountId = accountIdData;
      const response = await updateAccount(
        businessId,
        accountId,
        accountFormData,
        token
      );

      if (!response.ok) {
        throw new Error("Something went wrong when updating account.");
      }

      // Reset form data
      setAccountFormData({});
      setAccountIdData("");

      // Close modal
      setShowModal(false);

      // Get business data again to update visible accounts
      const refetch = await getBusiness(businessId, token);

      if (!refetch.ok) {
        throw new Error(
          "Something went wrong while getting business information."
        );
      }

      const business = await refetch.json();
      setBusinessData(business);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async (businessId, accountId) => {
    // Check token before proceeding
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    // Since deleteAccount and getBusiness are asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
    try {
      const response = await deleteAccount(businessId, accountId, token);

      if (!response.ok) {
        throw new Error("Something went wrong while deleting account.");
      }

      // Get business data again to update visible accounts
      const refetch = await getBusiness(businessId, token);

      if (!refetch.ok) {
        throw new Error(
          "Something went wrong while getting business information."
        );
      }

      const business = await refetch.json();
      setBusinessData(business);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Display sum of accounts */}
      <p>
        {businessData.accounts.length
          ? `Total balance: $${businessData.totalBalance}`
          : "Please add your first account to get started!"}
      </p>
      {/* For each account, render a card */}
      <Container>
        <Row xs={1} md={3} className="g-4">
          {businessData.accounts.map((account) => {
            return (
              <Col key={account._id} className="container-fluid g-4">
                <Card className="card border-0 h-100 p-3 d-flex text-center">
                  <Card.Body>
                    <Card.Title>
                      <h3>{account.name}</h3>
                    </Card.Title>
                    <Card.Text>${account.balance}</Card.Text>
                    <div className="d-flex justify-content-around">
                      {/* If user is an admin or an editor, show update button */}
                      {Auth.isAdmin() || Auth.isEditor() ? (
                        <Button
                          className="btn"
                          variant="success"
                          onClick={() =>
                            handleShowModal(businessData._id, account._id)
                          }>
                          Update
                        </Button>
                      ) : (
                        " "
                      )}
                      {/* If user is an admin, show delete button */}
                      {Auth.isAdmin() ? (
                        <Button
                          className="btn"
                          variant="success"
                          onClick={() =>
                            handleDeleteAccount(businessData._id, account._id)
                          }>
                          Delete
                        </Button>
                      ) : (
                        " "
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>

      {/* Modal to update account */}
      <Modal
        centered
        className="d-flex justify-content-center"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="update-account-modal">
        <Tab.Container>
          <Modal.Header closeButton>
            <h3>Update an account</h3>
          </Modal.Header>
          <Modal.Body>
            <Form
              handleModalClose={() => setShowModal(false)}
              noValidate
              validated={validated}
              onSubmit={handleUpdateFormSubmit}>
              {/* Show alert if server response is bad */}
              <Alert
                dismissible
                onClose={() => setShowAlert(false)}
                show={showAlert}
                variant="danger">
                Something went wrong.
              </Alert>

              {/* Account name input */}
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="name"
                  onChange={handleInputChange}
                  value={accountFormData.name}
                  required
                />
                <Form.Control.Feedback type="invalid" muted>
                  Please add a name for your account.
                </Form.Control.Feedback>
              </Form.Group>

              {/* Account balance input */}
              <Form.Group className="mb-3">
                <div className="input-group d-flex align-items-center">
                  <p>$</p>
                  <Form.Control
                    type="number"
                    placeholder="Account starting balance"
                    name="balance"
                    min="0.01"
                    step="0.01"
                    onChange={handleInputChange}
                    value={accountFormData.balance}
                    required
                  />
                </div>
                <Form.Control.Feedback type="invalid" muted>
                  Please add a starting balance for your account.
                </Form.Control.Feedback>
              </Form.Group>

              {/* On form submit, update account */}
              <Button type="submit" variant="success">
                Create
              </Button>
            </Form>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AccountList;
