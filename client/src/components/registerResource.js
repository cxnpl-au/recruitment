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

  const handleRegisterResource = () => {
    axios({
      // Endpoint to send files
      url: "http://localhost:8080/api/resource/registerResource",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": user.token,
      },
      data: {
        resourceName: resourceName,
      },
    })
      // Handle the response from backend here
      .then((res) => {
        console.log(user.token);
        addResource(res.data);
      })

      // Catch errors if any
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {registerForm ? (
        <div>
          <input
            placeholder="Resource name"
            onChange={handleResourceNameInput}
          />
          <button onClick={handleRegisterResource}>Register</button>
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
