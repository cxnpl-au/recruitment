import { useState } from "react";
import "../styles/Forms.css"
import { loginUser } from "../api/routes/userRoutes"
import { useNavigate } from "react-router-dom";
import AuthService from "../authorisation/auth.js";
import { setUserPermissions, setBusinessId, setUserName } from "../authorisation/session.js";

export const LoginRoute = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validateEmail = () => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const validForm = () => {
    //all fields required
    if(email === ''){
      alert("Email is required");
      return false;
    }
    if(password === ''){
      alert("Password is required");
      return false;
    }

    if(!validateEmail()){
      alert("Incorect email format");
      return false;
    }

    return true;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if(!validForm()) {
      return
    }
    
    const loginRequest = {
      email: email,
      password: password
    }

    try {
      const response = await loginUser(loginRequest);

      if(response.status !== 200) {
        throw new Error("Error logging in");
      }
      const { token, user } = await response.json();

      setUserPermissions(user.permissions);
      setUserName(user.name);
      setBusinessId(user.businessId);
      AuthService.login(token);

      navigate("/dashboard");
    } catch (error) {
       alert(error);
    }
  }


  return (
    <div className="forms">
      <div className="form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <label htmlFor="email">Email</label>
          <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="email" id="email" name="email"/>


          <label htmlFor="password">Password</label>
          <input value={password} onChange={(e)=> setPassword(e.target.value)}type="password" placeholder="*******" id="password" name="password"/>

          <button className="form-button" type="submit">login</button>
        </form>
        <button className="link-button" onClick={() => navigate('/signup')}>Don't have an account? Sign up here.</button>
        <button className="link-button" onClick={() => navigate('/')}>Want to add a business?</button>
      </div>
      </div>
  );
}