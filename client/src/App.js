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
          <div className="home">
            <Link to="/">Home</Link>
          </div>
          {user.token === "" ? (
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

        <div
          style={{ gridRow: "1/2", gridColumn: "1/2", background: "#0067C8" }}
        >
          <p>{user.userId}</p>
        </div>
        <div
          style={{ gridRow: "1/2", gridColumn: "3/4", background: "#0067C8" }}
        />
        <div
          style={{ gridRow: "3/4", gridColumn: "1/2", background: "#0067C8" }}
        />
        <div
          style={{ gridRow: "3/4", gridColumn: "3/4", background: "#0067C8" }}
        />

        {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
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
