
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SignupRoute } from "./routes/SignupRoute";
import { LoginRoute } from "./routes/LoginRoute";
import { HomeRoute } from "./routes/HomeRoute";
import { DashboardRoute } from "./routes/DashboardRoute";
import { TeamRoute } from "./routes/TeamRoute";
import { ProjectsRoute } from "./routes/ProjectsRoute";

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomeRoute/>} />
          <Route path="/signup" element={<SignupRoute/>} />
          <Route path="/login" element={<LoginRoute/>} />
          <Route path="/dashboard" element={<DashboardRoute/>} />
          <Route path="/team" element={<TeamRoute/>} />
          <Route path="/projects" element={<ProjectsRoute/>} />
        </Routes>
      </Router>
  );
}

export default App;
