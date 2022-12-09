import React from "react";

// Import components
import PasswordResetForm from "../components/PasswordResetForm";

const GetStarted = () => {
  return (
    <main>
      {/* Page title */}
      <h2>Reset password</h2>
      <p>Please enter your new password below.</p>
      {/* Form for resetting password */}
      <PasswordResetForm />
    </main>
  );
};

export default GetStarted;
