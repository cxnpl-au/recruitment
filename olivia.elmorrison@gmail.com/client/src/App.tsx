
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SignupRoute } from "./routes/SignupRoute";
import { LoginRoute } from "./routes/LoginRoute";
import { ApplicationRoute } from "./routes/ApplicationRoute";
import { HomeRoute } from "./routes/HomeRoute";
import "./styles/App.css"

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomeRoute/>} />
          <Route path="/signup" element={<SignupRoute/>} />
          <Route path="/login" element={<LoginRoute/>} />
          <Route path="/application" element={<ApplicationRoute/>} />
          {/* TODO:  */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
