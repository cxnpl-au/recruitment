import React from "react";
import {
  BrowserRouter as Router,
  Routes ,
  Route,
  Link
} from "react-router-dom";

import './App.css'

import UserContextProvider from '../src/context/userContext';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Details from "./pages/Details";

function App() {
  return (
    <UserContextProvider>
        <Router >
          <div className='container'>
            <nav className='header'> 
              <div className='home'>
                <Link to="/">Home</Link>
              </div>
              <div className='login'>
                <Link to="/login">Login</Link>
              </div>
              <div className='signup'>
                <Link to="/signup">Signup</Link>
              </div>
              <div className='details'>
                <Link to="/details">Details</Link>
              </div>
            </nav>

            <div style={{gridRow:'1/2', gridColumn: '1/2', background: '#0067C8'}}/>
            <div style={{gridRow:'1/2', gridColumn: '3/4', background: '#0067C8'}}/>
            
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <div style={{gridRow:'2/3', gridColumn: '2/3'}}>
              <Routes >
                <Route exact path="/" element = { <Home />}/ >
                <Route path="/login" element = { <Login />}/ >
                <Route path="/signup" element = { <Signup />}/ >
                <Route path="/details" element = { <Details />}/ >

              </Routes >
            </div>
            
 
          </div>
        </Router>
    </UserContextProvider>
  );
}

export default App;