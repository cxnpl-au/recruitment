import React from "react";

// Import Link component for all internal application hyperlinks
import { Link } from "react-router-dom";

// Import components
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <main>
      {/* Page title */}
      <h2>Log in</h2>
      {/* Form for logging in */}
      <LoginForm />
      <p>Don't have an account?</p>
      <Link to={`/getstarted`}>Click here to sign up instead.</Link>
    </main>
  );
};

export default Login;
