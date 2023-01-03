import React from "react";

// Import router components
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Import components
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import RequestPasswordResetReceived from "./pages/RequestPasswordResetReceived";
import PasswordReset from "./pages/PasswordReset";
import NoMatch from "./pages/NoMatch";

function App() {
  return (
    <Router>
      <>
        <Nav />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/getstarted" component={GetStarted} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/admin" component={Admin} />
          <Route
            exact
            path="/requestpasswordreset"
            component={RequestPasswordReset}
          />
          <Route
            exact
            path="/requestpasswordresetreceived"
            component={RequestPasswordResetReceived}
          />
          <Route path="/passwordreset" component={PasswordReset} />
          <Route path="*" component={NoMatch} />
        </Switch>
        <Footer />
      </>
    </Router>
  );
}

export default App;
