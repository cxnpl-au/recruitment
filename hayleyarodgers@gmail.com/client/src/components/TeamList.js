import React, { useState, useEffect } from "react";

// Import bootstrap components
import { Card, Tab, Modal, Alert, Form, Button } from "react-bootstrap";

// Import API call, authentication token and getting business id from local storage functions
import { getTeam, getUser, updateUser, deleteUser } from "../utils/API";
import Auth from "../utils/auth";
import { getSavedBusinessId } from "../utils/localStorage";

const TeamList = () => {
  // Set update user modal display state
  const [showModal, setShowModal] = useState(false);

  // Set state for user data
  const [userFormData, setUserFormData] = useState({});

  // Set state for form validation
  const [validated] = useState(false);

  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // Set state for user id
  const [userIdData, setUserIdData] = useState("");

  // Set initial state
  const [teamData, setTeamData] = useState({});

  // Use to determine if `useEffect()` hook needs to run again
  const teamDataLength = Object.keys(teamData).length;

  // Get team data
  useEffect(() => {
    const getTeamData = async () => {
      // Check token before proceeding
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        return false;
      }

      // Get business id saved in local storage
      const businessId = getSavedBusinessId();

      // Since getTeam is asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
      try {
        const response = await getTeam(businessId, token);

        if (!response.ok) {
          throw new Error(
            "Something went wrong while getting team information."
          );
        }

        const team = await response.json();
        setTeamData(team);
      } catch (err) {
        console.error(err);
      }
    };

    getTeamData();
  }, [teamDataLength]);

  // If data isn't here yet, say so
  if (!teamDataLength) {
    return <h2>Loading...</h2>;
  }

  // Show update modal
  const handleShowModal = async (userId) => {
    // Check token before proceeding
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    // Get data to prefill modal
    const response = await getUser(userId, token);

    if (!response.ok) {
      throw new Error("Something went wrong getting user data.");
    }

    const user = await response.json();

    setUserFormData(user);
    setUserIdData(userId);

    // Show modal
    setShowModal(true);
  };

  // When the input of any form field changes, set form data
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Update user
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

    // Since updateUser is asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
    try {
      const userId = userIdData;
      const response = await updateUser(userId, userFormData, token);

      if (!response.ok) {
        throw new Error("Something went wrong when updating user.");
      }

      // Reset form data
      setUserFormData({});
      setUserIdData("");

      // Close modal
      setShowModal(false);

      // Get team data again to update visible users
      const businessId = getSavedBusinessId();
      const refetch = await getTeam(businessId, token);

      if (!refetch.ok) {
        throw new Error("Something went wrong while getting team information.");
      }

      const team = await refetch.json();
      setTeamData(team);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    // Check token before proceeding
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    // Since deleteUser and getTeam are asynchronous, wrap in a `try...catch` to catch any network errors from throwing due to a failed request
    try {
      const response = await deleteUser(userId, token);

      if (!response.ok) {
        throw new Error("Something went wrong while deleting user.");
      }

      // Get team data again to update visible users
      const businessId = getSavedBusinessId();
      const refetch = await getTeam(businessId, token);

      if (!refetch.ok) {
        throw new Error("Something went wrong while getting team information.");
      }

      const team = await refetch.json();
      setTeamData(team);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* For each user, render a card */}
      {teamData.map((user) => {
        return (
          <Card key={user._id} className="card mb-3 border-0">
            <Card.Body className="d-flex user p-4 justify-content-between align-items-center">
              <div className="width-controller">
                <h3>{user.username}</h3>
              </div>
              <div className="width-controller">
                <p>{user.role}</p>
              </div>
              {user.role !== "admin" ? (
                <div className="d-flex justify-content-around">
                  <Button
                    className="btn"
                    variant="success"
                    onClick={() => handleShowModal(user._id)}>
                    Update permissions
                  </Button>
                  <Button
                    className="btn"
                    variant="success"
                    onClick={() => handleDeleteUser(user._id)}>
                    Delete user
                  </Button>
                </div>
              ) : (
                <div className="d-flex justify-content-around">
                  <Button className="btn" disabled>
                    Update permissions
                  </Button>
                  <Button className="btn" disabled>
                    Delete user
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}

      {/* Modal to update user permissions */}
      <Modal
        centered
        className="d-flex justify-content-center"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="update-user-modal">
        <Tab.Container>
          <Modal.Header closeButton>
            <h3>Update {userFormData.username}'s permissions</h3>
          </Modal.Header>
          <Modal.Body>
            <Form
              noValidate
              validated={validated}
              onSubmit={handleUpdateFormSubmit}>
              {/* Show alert if server response is bad */}
              <Alert
                dismissible
                onClose={() => setShowAlert(false)}
                show={showAlert}
                variant="danger">
                Something went wrong during user update.
              </Alert>

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

              {/* On form submit, update user */}
              <Button type="submit" variant="success">
                Update
              </Button>
            </Form>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default TeamList;
