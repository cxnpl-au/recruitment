import { useState } from "react";
import "../styles/Forms.css"
import * as userRoutes from "../api/routes/userRoutes"
import { useNavigate } from "react-router-dom";

export const LoginRoute = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  //TODO: Validations

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const loginRequest : userRoutes.LoginUserRequest = {
      email: email,
      password: password
    }

    try {
      const response = await userRoutes.loginUser(loginRequest);

        if(response.status === 200) {
          navigate("/application")
        } else {
          //TODO: Alert
        }
    } catch (error) {
      console.log(error)
    }
  }

  return (
      <div className="auth-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <label htmlFor="email">Email</label>
          <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="email" id="email" name="email"/>


          <label htmlFor="password">Password</label>
          <input value={password} onChange={(e)=> setPassword(e.target.value)}type="password" placeholder="*******" id="password" name="password"/>

          <button type="submit">login</button>
        </form>
        <button className="link-button" onClick={() => navigate('/signup')}>Don't have an account? Sign up here.</button>
      </div>
  );
}