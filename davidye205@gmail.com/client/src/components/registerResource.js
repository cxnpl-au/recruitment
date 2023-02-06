import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";

import "../styles/registerResource.css";

export function RegisterResource({ addResource }) {
  const [registerForm, setRegisterForm] = useState(false);
  const [resourceName, setResourceName] = useState("");

  const { user } = useContext(UserContext);

  const handleResourceNameInput = (e) => {
    setResourceName(e.target.value);
  };

  const handleRegisterResource = async () => {
    try {
      let newResource = await axios({
        // Endpoint to send files
        url: "http://localhost:8080/api/resources/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": user.token,
        },
        data: {
          resourceName: resourceName,
        },
      });
      //add to state
      addResource(newResource.data);
      setRegisterForm(!registerForm);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="registerResourceContainer">
      {registerForm ? (
        <div>
          <input
            placeholder="Resource name"
            style={{ marginRight: "10px" }}
            onChange={handleResourceNameInput}
          />
          <button
            style={{ marginRight: "10px" }}
            onClick={handleRegisterResource}
          >
            Register
          </button>
          <button
            onClick={() => {
              setRegisterForm(!registerForm);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              setRegisterForm(!registerForm);
            }}
          >
            New resource
          </button>
        </div>
      )}
    </div>
  );
}
