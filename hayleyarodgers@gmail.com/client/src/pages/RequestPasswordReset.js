import React from "react";

// Import components
import RequestPasswordResetForm from "../components/RequestPasswordResetForm";

const RequestPasswordReset = () => {
  return (
    <main>
      {/* Page title */}
      <h2>Reset password</h2>
      <p>Please enter your email to reset your password.</p>
      {/* Form for requesting password reset */}
      <RequestPasswordResetForm />
    </main>
  );
};

export default RequestPasswordReset;
