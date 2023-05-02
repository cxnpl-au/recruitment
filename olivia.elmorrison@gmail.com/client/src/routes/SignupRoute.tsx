import { useEffect, useState } from "react";
import "../styles/Forms.css"
import * as userRoutes from "../api/routes/userRoutes"
import { useNavigate } from "react-router-dom";
import AuthService from "../authorisation/auth.js";
import { setUserPermissions, setBusinessId, setUserName } from "../authorisation/session.js";
import { getAllBusinesses } from "../api/routes/businessRoutes";

export const SignupRoute = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [selectedBusinessName, setSelectedBusinessName] = useState('');
    const [allBusinesses, setAllBusinesses] = useState<any>([]);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchBusinesses = async () => {
        try {
          const response = await getAllBusinesses();
  
          if (!response.ok) {
            throw new Error(
              "Error when getting businesses information."
            );
          }
  
          const businesses = await response.json();
          setAllBusinesses(businesses);
          if(businesses.length > 1){
            setSelectedBusinessName(businesses[0].name);
          }
        } catch (error) {
          alert(error);
        }
        };
        fetchBusinesses();
    }, [allBusinesses.length]);

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
      if(selectedBusinessName ===''){
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

      if(!validForm()){
        return;
      }
      const selectedBusiness = allBusinesses.find((business: any)=> business.name === selectedBusinessName);

      const request = {
        name: name,
        email: email,
        password: password,
        businessId: selectedBusiness._id
      }

      try {
        const response = await userRoutes.signupUser(request);

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
            <h2>Create Account</h2>
            <label htmlFor={selectedBusinessName} style={{padding: "10px"}}>Choose existing business:</label>
            <select 
              value={selectedBusinessName} 
              onChange={e => setSelectedBusinessName(e.target.value)}
            >
              { allBusinesses.map((business: any) => {
                return (
                  <option key={business._id} value={business.name}>{business.name}</option>
                )
              })}
            </select>
            <label htmlFor="name">Full Name</label>
            <input value={name} onChange={(e)=> setName(e.target.value)} type="text" placeholder="Full Name" id="name" name="name"/>

            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email"/>


            <label htmlFor="password">Password</label>
            <input value={password} onChange={(e)=> setPassword(e.target.value)}type="password" placeholder="*******" id="password" name="password"/>

            <button className="form-button" type="submit">sign up</button>
          </form>
          <button className="link-button" onClick={() => navigate("/login")}>Already have an account? Login here.</button>
          <button className="link-button" onClick={() => navigate('/')}>Want to add a business?</button>
        </div>
    </div>
    );
  }