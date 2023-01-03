import React, { useState } from "react";

// Import bootstrap components
import { Form, Button, Alert } from "react-bootstrap";

// Import API call and saving business id to local storage functions
import { createBusiness } from "../utils/API";
import { saveBusinessId } from "../utils/localStorage";

const CreateBusinessForm = () => {
  // Set initial business form state
  const [businessFormData, setBusinessFormData] = useState({
    name: "",
  });

  // Set state for form validation
  const [validated] = useState(false);

  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // When the input of business name field changes, set form data
  const handleBusinessInputChange = (event) => {
    const { name, value } = event.target;
    setBusinessFormData({ ...businessFormData, [name]: value });
  };

  // Create business
  // Business is created before sign up so its id can be saved in local storage and then copied into newly created user
  const handleFormSubmit = async (event) => {
    // Stop default page refresh
    event.preventDefault();

    // Check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Since createBusiness is asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
    try {
      const response = await createBusiness(businessFormData);

      if (!response.ok) {
        throw new Error("Something went wrong during business creation.");
      }

      // Save business' id to local storage
      const business = await response.json();
      saveBusinessId(business._id);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // Reset form data
    setBusinessFormData({
      name: "",
    });

    window.location.assign("/signup");
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

        {/* Business name input */}
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Business name"
            name="name"
            onChange={handleBusinessInputChange}
            value={businessFormData.name}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please add a name for your business.
          </Form.Control.Feedback>
        </Form.Group>

        {/* On form submit, sign up */}
        <Button type="submit" variant="success">
          Next
        </Button>
      </Form>
    </>
  );
};

export default CreateBusinessForm;
