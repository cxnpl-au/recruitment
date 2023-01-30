import React from "react";
import {
  BrowserRouter as Router,
  Routes ,
  Route,
  Link
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Details from "./pages/Details";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li>
              <Link to="/details">Details</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route exact path="/" element = { <Home />}/ >
          <Route path="/login" element = { <Login />}/ >
          <Route path="/signup" element = { <Signup />}/ >
          <Route path="/details" element = { <Details />}/ >

        </Routes >
      </div>
    </Router>
  );
}

export default App;