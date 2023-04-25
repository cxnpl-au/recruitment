import "../styles/Application.css"
import { useNavigate } from "react-router-dom";

export const Nav = () => {
    const navigate = useNavigate();

    return (
      <div className="nav-bar">
        <div className="nav-buttons">
            <button className="nav-button" onClick={() => navigate('/dashboard')}>DASHBOARD</button>
            <p className="nav-label">MANAGE</p>
            <button className="nav-button" onClick={() => navigate('/team')}>TEAM</button>
            <button className="nav-button" onClick={() => navigate('/projects')}>PROJECTS</button>
        </div>
      </div>
    );
  }

