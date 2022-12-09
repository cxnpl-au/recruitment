import React, { useState } from "react";

// Import bootstrap components
import { Form, Button, Alert } from "react-bootstrap";

// Import Link component for all internal application hyperlinks
import { Link } from "react-router-dom";

// Import API call, authentication token and saving user role to local storage functions
import { loginUser } from "../utils/API";
import Auth from "../utils/auth";
import { saveUserRole, saveBusinessId } from "../utils/localStorage";

const LoginForm = () => {
  // Set initial form state
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: "",
  });

  // Set state for form validation
  const [validated] = useState(false);

  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // When the input of any form field changes, set form data
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Log in user
  const handleFormSubmit = async (event) => {
    // Stop default page refresh
    event.preventDefault();

    // Check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Since loginUser is asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
    try {
      const response = await loginUser(userFormData);

      if (!response.ok) {
        throw new Error("Something went wrong during log in.");
      }

      const { token, user } = await response.json();
      // Save user's role, business id and token to local storage
      saveUserRole(user.role);
      saveBusinessId(user.businessId);
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // Reset form data
    setUserFormData({
      username: "",
      password: "",
    });
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
          Something went wrong with your log in.
        </Alert>

        {/* User username input */}
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter your username.
          </Form.Control.Feedback>
        </Form.Group>

        {/* User password input */}
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          {/* Reset password */}
          <Link
            to={`/requestpasswordreset`}
            className="d-flex align-items-right">
            Forgot password?
          </Link>
          <Form.Control.Feedback type="invalid">
            Please enter your password.
          </Form.Control.Feedback>
        </Form.Group>

        {/* On form submit, log in */}
        <Button type="submit" variant="success">
          Log in
        </Button>
        <hr></hr>
      </Form>
    </>
  );
};

export default LoginForm;
