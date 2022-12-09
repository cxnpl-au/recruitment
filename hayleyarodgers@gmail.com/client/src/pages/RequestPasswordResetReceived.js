import React from "react";

// Import Link component for all internal application hyperlinks
import { Link } from "react-router-dom";

const RequestPasswordResetReceived = () => {
  return (
    <main>
      {/* Page title */}
      <h2>Reset password request received</h2>
      <p>Please check your email for a link to reset your password.</p>
      <Link className="btn mx-3" to={`/login`}>
        Go back to log in page
      </Link>
    </main>
  );
};

export default RequestPasswordResetReceived;
