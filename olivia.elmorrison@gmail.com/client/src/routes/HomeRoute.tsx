import { useState } from "react";
import "../styles/Forms.css"
import * as userRoutes from "../api/routes/userRoutes"
import { useNavigate } from "react-router-dom";
import AuthService from "../authorisation/auth.js";
import { setUserPermissions, setBusinessId, setUserName } from "../authorisation/session.js";

export const HomeRoute = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [businessName, setBusinessName] = useState('');
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
      if(businessName ===''){
        alert("Please select a business");
        return false;
      }
  
      if(!validateEmail()){
        alert("Incorect email format");
        return false;
      }
  
      return true;
    }
  
    const handleSubmit = async (e : any) => {
      e.preventDefault();

      if(!validForm()) return;

      const signUpRequest = {
        name: name,
        email: email,
        password: password,
        businessName: businessName
      }

      try {
        const response = await userRoutes.createUserAndBusiness(signUpRequest);

        if(response.status !== 201) {
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
          <form className="signup-form" onSubmit={handleSubmit}>
            <h2>Get Started!</h2>
            <h3>Create Business</h3>
            <label htmlFor="businessName">Business Name</label>
            <input value={businessName} onChange={(e)=> setBusinessName(e.target.value)} type="text" placeholder="Business Name" id="businessName" name="businessName"/>

            <label htmlFor="name">Full Name</label>
            <input value={name} onChange={(e)=> setName(e.target.value)} type="text" placeholder="Full Name" id="name" name="name"/>

            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email"/>


            <label htmlFor="password">Password</label>
            <input value={password} onChange={(e)=> setPassword(e.target.value)}type="password" placeholder="*******" id="password" name="password"/>

            <button className="form-button" type="submit">sign up</button>
          </form>
          <button className="link-button" onClick={() => navigate("/login")}>Already have an account? Login here.</button>
          <button className="link-button" onClick={() => navigate("/signup")}>Want to sign up to an existing business? Sign up here</button>
        </div>
    </div>
    );
  }