import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

function Login() {
    const [email, setEmail] = useState('davidye205@gmail.com');
    const [password, setPassword] = useState('qwerty1234');
    const { setUser } = useContext(UserContext);

    let navigate = useNavigate();
  
    const login = (e) => {
        axios({
      
          // Endpoint to send files
          url: "http://localhost:8080/api/user/login",
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
  
          // Attaching the form data
          data: {
            email: email,
            password: password
          }
        })
        

        // Handle the response from backend here
        .then((res) => { 
          console.log(res.data)
          setUser({token: res.data});
          navigate("/");
        })
    
        // Catch errors if any
        .catch((err) => { 
          console.log(err)
         });
    
    }

    const handleEmailInput = (e) => {
      setEmail(e.target.value)
    }
    const handlePasswordInput = (e) => {
      setPassword(e.target.value)
    }
    
    return (
      <div>
        <input placeholder="email" onChange={handleEmailInput}></input>
        <input placeholder="password" onChange={handlePasswordInput}></input>
        <button onClick={login}>CLICK ME</button>
      </div>
    );
  }
  
  export default Login;
  