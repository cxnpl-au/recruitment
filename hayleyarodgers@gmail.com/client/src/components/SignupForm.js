import React, { useState } from "react";

// Import bootstrap components
import { Form, Button, Alert } from "react-bootstrap";

// Import API call, authentication token and saving user role to local storage functions
import { signupUser } from "../utils/API";
import Auth from "../utils/auth";
import { saveUserRole, getSavedBusinessId } from "../utils/localStorage";

const SignupForm = () => {
  // Set initial user form state
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin", // first user to sign up and create a business is an admin by default
    businessId: getSavedBusinessId(),
  });

  // Set state for form validation
  const [validated] = useState(false);

  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // When the input of any user form field changes, set form data
  const handleUserInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Sign up new user
  const handleFormSubmit = async (event) => {
    // Stop default page refresh
    event.preventDefault();

    // Check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Since signupUser is asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
    try {
      const response = await signupUser(userFormData);

      if (!response.ok) {
        throw new Error("Something went wrong during sign up.");
      }

      // Save user's role and token to local storage
      const { token, user } = await response.json();
      saveUserRole(user.role);
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // Reset form data
    setUserFormData({
      username: "",
      email: "",
      password: "",
      role: "admin",
      businessId: getSavedBusinessId(),
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
          Something went wrong with your sign up.
        </Alert>

        {/* User username input */}
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleUserInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please add a username.
          </Form.Control.Feedback>
        </Form.Group>

        {/* User email input */}
        <Form.Group>
          <Form.Control
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleUserInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please add a valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        {/* User password input */}
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleUserInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please add a password.
          </Form.Control.Feedback>
        </Form.Group>

        {/* On form submit, sign up */}
        <Button type="submit" variant="success">
          Sign up
        </Button>
        <hr></hr>
      </Form>
    </>
  );
};

export default SignupForm;
