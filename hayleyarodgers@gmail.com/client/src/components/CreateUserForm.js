import React, { useState } from "react";

// Import bootstrap components
import { Form, Button, Alert } from "react-bootstrap";

// Import API call, authentication token, getting saved business Id from local storage and generating random password functions
import { createUser } from "../utils/API";
import Auth from "../utils/auth";
import { getSavedBusinessId } from "../utils/localStorage";
import { generateRandomPassword } from "../utils/randomPasswordGenerator";

const CreateUserForm = ({ handleModalClose }) => {
  // Set initial user form state
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: generateRandomPassword(), // generate random first password, user will then reset and create their own later
    role: "",
    businessId: getSavedBusinessId(),
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

  // Create new user
  const handleFormSubmit = async (event) => {
    // Stop page refresh
    event.preventDefault();

    // Check token before proceeding
    const token = Auth.loggedIn() && Auth.isAdmin() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    // Check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Since createUser is asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
    try {
      const response = await createUser(userFormData, token);

      if (!response.ok) {
        throw new Error("Something went wrong when creating user.");
      }

      // Reset form data
      setUserFormData({
        username: "",
        email: "",
        password: generateRandomPassword(),
        role: "",
        businessId: getSavedBusinessId(),
      });

      // Reload page to show newly created user
      window.location.assign("/admin");
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
        Something went wrong with your user creation.
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
          Please add a username.
        </Form.Control.Feedback>
      </Form.Group>

      {/* User email input */}
      <Form.Group>
        <Form.Control
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleInputChange}
          value={userFormData.email}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please add a valid email address.
        </Form.Control.Feedback>
      </Form.Group>

      {/* User role input */}
      <Form.Group className="mb-3">
        <Form.Select
          name="role"
          onChange={handleInputChange}
          value={userFormData.role}
          required>
          <option defaultValue>Choose permissions</option>
          <option value="admin">admin</option>
          <option value="editor">editor</option>
          <option value="viewer">viewer</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid" muted>
          Please add role.
        </Form.Control.Feedback>
      </Form.Group>

      {/* On form submit, create user */}
      <Button type="submit" variant="success" onClick={handleModalClose}>
        Create
      </Button>
    </Form>
  );
};

export default CreateUserForm;
