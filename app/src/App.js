import "./App.css";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProvideAuth } from "./services/useAuth";
import Home from "./pages/Home";
import Users from "./pages/Users";
import SignUp from "./pages/Signup";
import Settings from "./pages/Settings";

function App() {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </ProvideAuth>
  );
}

export default App;
