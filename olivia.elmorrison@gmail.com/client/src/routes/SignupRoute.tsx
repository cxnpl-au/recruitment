import { useState } from "react";
import "../styles/Forms.css"
import * as userRoutes from "../api/routes/userRoutes"
import { useNavigate } from "react-router-dom";
import AuthService from "../authorisation/auth.js";
import { saveUserPermissions, saveBusinessId } from "../authorisation/session.js";

export const SignupRoute = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e : any) => {
      e.preventDefault();

      const signUpRequest : userRoutes.SignupUserRequest = {
        name: name,
        email: email,
        password: password
      }

      try {
        const response = await userRoutes.signupUser(signUpRequest);

        if(response.status !== 200) {
          throw new Error("Error logging in");
        }
        const { token, user } = await response.json();
  
        saveUserPermissions(user.permissions);
        saveBusinessId(user.businessId);
        AuthService.login(token);
  
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
      }
    }
  
    return (
      <div className="forms">
        <div className="form-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <label htmlFor="name">Full Name</label>
            <input value={name} onChange={(e)=> setName(e.target.value)} type="text" placeholder="Full Name" id="name" name="name"/>

            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email"/>


            <label htmlFor="password">Password</label>
            <input value={password} onChange={(e)=> setPassword(e.target.value)}type="password" placeholder="*******" id="password" name="password"/>

            <button className="form-button" type="submit">sign up</button>
          </form>
          <button className="link-button" onClick={() => navigate("/login")}>Already have an account? Login here.</button>
        </div>
    </div>
    );
  }