import React from "react";

// Import bootstrap components
import { Navbar, Nav, Container } from "react-bootstrap";

// Import Link component for all internal application hyperlinks
import { Link } from "react-router-dom";

// Import authentication token function
import Auth from "../utils/auth";

// Import getting saved user role from local storage
import { getSavedUserRole } from "../utils/localStorage";

// Import custom styles
import "../styles/Nav.css";

const AppNavbar = () => {
  const role = getSavedUserRole();

  return (
    <>
      <Navbar className="nav" variant="dark" expand="lg">
        <Container fluid>
          <div className="d-flex flex-column">
            <Navbar.Brand className="brandName" as={Link} to="/">
              <h1 className="un">IM service</h1>
            </Navbar.Brand>
            <p>
              <a
                href="https://github.com/hayleyarodgers"
                target="_blank"
                rel="noopener noreferrer"
                className="un">
                hayleyarodgers
              </a>{" "}
              x cxnpl
            </p>
          </div>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ml-auto">
              {/* If user is logged in and an admin, show dashboard, admin page and logout */}
              {/* If user is logged in and NOT an admin, just show logout */}
              {/* If user is not logged in, show log in */}
              {Auth.loggedIn() ? (
                Auth.isAdmin() ? (
                  <>
                    <Nav.Link className="un px-4" as={Link} to="/dashboard">
                      Accounts
                    </Nav.Link>
                    <Nav.Link className="un px-4" as={Link} to="/admin">
                      Team
                    </Nav.Link>
                    <Nav.Link className="un px-4" onClick={Auth.logout}>
                      Log out
                    </Nav.Link>
                  </>
                ) : (
                  <Nav.Link className="un px-4" onClick={Auth.logout}>
                    Log out
                  </Nav.Link>
                )
              ) : (
                <Nav.Link className="un px-4" as={Link} to={`/login`}>
                  Log in
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* If user is logged in, show role for demonstration purposes */}
      {Auth.loggedIn() ? (
        <div className="role">
          <p>
            You are currently viewing the site as{" "}
            {role === "viewer" ? "a" : "an"} <b>{role}</b>.
          </p>
        </div>
      ) : (
        <br></br>
      )}
    </>
  );
};

export default AppNavbar;
