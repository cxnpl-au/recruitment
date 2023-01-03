import React, { useState } from "react";

// Import bootstrap components
import { Form, Button, Alert } from "react-bootstrap";

// Import API call
import { requestResetPassword } from "../utils/API";

const PasswordResetForm = () => {
  // Set initial form state
  const [formData, setFormData] = useState({
    email: "",
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

  // Request password reset email
  const handleFormSubmit = async (event) => {
    // Stop default page refresh
    event.preventDefault();

    // Check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Since requestResetPassword is asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
    try {
      const response = await requestResetPassword(formData);

      if (!response.ok) {
        throw new Error("Something went wrong during password reset request.");
      }
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // Reset form data
    setFormData({
      email: "",
    });

    window.location.assign("/requestpasswordresetreceived");
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
          Something went wrong with your password reset request.
        </Alert>

        {/* Email input */}
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Email"
            name="email"
            onChange={handleInputChange}
            value={formData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please add an email.
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
