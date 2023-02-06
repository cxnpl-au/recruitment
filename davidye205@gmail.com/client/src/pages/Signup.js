import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import "../styles/Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

  let navigate = useNavigate();

  const signup = (e) => {
    axios({
      // Endpoint to send files
      url: "http://localhost:8080/api/users/register",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Attaching the form data
      data: {
        name: name,
        email: email,
        password: password,
      },
    })
      // Handle the response from backend here
      .then((res) => {
        console.log(res.data);
        setUser({ token: res.data });
        navigate("/dashboard");
      })

      // Catch errors if any
      .catch((err) => {
        console.log(err);
      });
  };

  const handleNameInput = (e) => {
    setName(e.target.value);
  };
  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="signupContainer">
      <div className="inputContainer">
        Name
        <input
          className="input"
          placeholder="name"
          onChange={handleNameInput}
        />
      </div>
      <div className="inputContainer">
        Email
        <input
          className="input"
          placeholder="email"
          onChange={handleEmailInput}
        />
      </div>
      <div className="inputContainer">
        Password
        <input
          className="input"
          placeholder="password"
          type="password"
          onChange={handlePasswordInput}
        />
      </div>

      <button onClick={signup}>Signup</button>
    </div>
  );
}

export default Signup;
