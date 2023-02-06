import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

  let navigate = useNavigate();

  const login = (e) => {
    axios({
      // Endpoint to send files
      url: "http://localhost:8080/api/users/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Attaching the form data
      data: {
        email: email,
        password: password,
      },
    })
      // Handle the response from backend here
      .then((res) => {
        console.log(res.data);
        setUser({ token: res.data.token, userId: res.data.userId });
        navigate("/dashboard");
      })

      // Catch errors if any
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="loginContainer">
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
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
