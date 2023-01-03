import React from "react";

// Import Link component for all internal application hyperlinks
import { Link } from "react-router-dom";

// Import components
import SignupForm from "../components/SignupForm";

const Signup = () => {
  return (
    <main>
      {/* Page title */}
      <h2>Sign up</h2>
      <p>All you'll need is a unique username, email and password.</p>
      {/* Form for signing up */}
      <SignupForm />
      <p>Already have an account?</p>
      <Link to={`/login`}>Click here to log in instead.</Link>
    </main>
  );
};

export default Signup;
