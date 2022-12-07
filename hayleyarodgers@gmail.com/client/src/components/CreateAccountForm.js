import React, { useState } from "react";

// Import bootstrap components
import { Form, Button, Alert } from "react-bootstrap";

// Import API call, authentication token and getting saved business Id from local storage functions
import { createAccount } from "../utils/API";
import Auth from "../utils/auth";
import { getSavedBusinessId } from "../utils/localStorage";

const CreateAccountForm = ({ handleModalClose }) => {
  // Set initial form state
  const [accountFormData, setAccountFormData] = useState({
    name: "",
    balance: 0,
  });

  // Set state for form validation
  const [validated] = useState(false);

  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // When the input of any form field changes, set form data
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAccountFormData({ ...accountFormData, [name]: value });
  };

  // Create new account
  const handleFormSubmit = async (event) => {
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

    // Since createAccount is asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
    try {
      const businessId = getSavedBusinessId();
      const response = await createAccount(businessId, accountFormData, token);

      if (!response.ok) {
        throw new Error("Something went wrong when creating account.");
      }

      // Reset form data
      setAccountFormData({
        name: "",
        balance: 0,
      });

      window.location.assign("/dashboard");
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
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

      {/* On form submit, create account */}
      <Button type="submit" variant="success" onClick={handleModalClose}>
        Create
      </Button>
    </Form>
  );
};

export default CreateAccountForm;
