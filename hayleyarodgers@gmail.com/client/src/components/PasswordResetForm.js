import React, { useState } from "react";

// Import bootstrap components
import { Form, Button, Alert } from "react-bootstrap";

// Import API call
import { resetPassword } from "../utils/API";

const PasswordResetForm = () => {
  // Get user id and token from URL parameters
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userId = urlParams.get("id");
  const token = urlParams.get("token");

  // Set initial form state
  const [formData, setFormData] = useState({
    userId: userId,
    token: token,
    password: "",
  });

  // Set state for form validation
  const [validated] = useState(false);

  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // When the input of a field changes, set form data
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Reset password
  const handleFormSubmit = async (event) => {
    // Stop default page refresh
    event.preventDefault();

    // Check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Since resetPassword is asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
    try {
      const response = await resetPassword(formData);

      if (!response.ok) {
        throw new Error("Something went wrong during password reset.");
      }
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // Reset form data
    setFormData({
      userId: userId,
      token: token,
      password: "",
    });

    window.location.assign("/login");
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Show alert if server response is bad */}
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger">
          Something went wrong with your password reset.
        </Alert>

        {/* Business name input */}
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleInputChange}
            value={formData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please add a new password.
          </Form.Control.Feedback>
        </Form.Group>

        {/* On form submit, sign up */}
        <Button type="submit" variant="success">
          Reset password
        </Button>
      </Form>
    </>
  );
};

export default PasswordResetForm;
