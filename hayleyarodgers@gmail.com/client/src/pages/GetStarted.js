import React from "react";

// Import components
import CreateBusinessForm from "../components/CreateBusinessForm";

const GetStarted = () => {
  return (
    <main>
      {/* Page title */}
      <h2>Get started</h2>
      <p>Give your business a name!</p>
      {/* Form for creating business */}
      <CreateBusinessForm />
    </main>
  );
};

export default GetStarted;
