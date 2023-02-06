import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./styles/App.css";

import { UserContext } from "../src/context/userContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  const { user, setUser } = useContext(UserContext);
  console.log(user);

  const signout = () => {
    console.log(user);
    setUser({ token: "" });
    console.log(user);
  };

  return (
    <Router>
      <div className="container">
        <nav className="header">
          {user.token == "" ? (
            <>
              <div className="login">
                <Link to="/login">Login</Link>
              </div>
              <div className="signup">
                <Link to="/signup">Signup</Link>
              </div>
            </>
          ) : (
            <>
              <div className="signup">
                <Link to="/" onClick={signout}>
                  Signout
                </Link>
              </div>
            </>
          )}
        </nav>
        <div style={{ gridRow: "2/3", gridColumn: "2/3" }}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
