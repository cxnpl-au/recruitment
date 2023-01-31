import axios from "axios";
import { useState } from 'react';

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signup = (e) => {
      axios({
        // Endpoint to send files
        url: "http://localhost:3000/api/user/register",
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },

        // Attaching the form data
        data: {
          name: name,
          email: email,
          password: password
        }
      })
      
  
      // Handle the response from backend here
      .then((res) => { 
        console.log(res)
      })
  
      // Catch errors if any
      .catch((err) => { 
        console.log(err)
       });
  
  }

  const handleNameInput = (e) => {
    setName(e.target.value)
  }
  const handleEmailInput = (e) => {
    setEmail(e.target.value)
  }
  const handlePasswordInput = (e) => {
    setPassword(e.target.value)
  }
  
  return (
    <div >
      <input placeholder="name" onChange={handleNameInput}></input>
      <input placeholder="email" onChange={handleEmailInput}></input>
      <input placeholder="password" onChange={handlePasswordInput}></input>

      <button onClick={signup}>CLICK ME</button>
    </div>
  );
  }
  
  export default Signup;
  