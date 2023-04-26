import "../styles/Application.css"
import { useNavigate } from "react-router-dom";
import AuthService from "../authorisation/auth.js";

export const Nav = () => {
    const navigate = useNavigate();

    const getManage = () => {
      return AuthService.hasNoPermissions() ?
      <></> :
      <>
        <p className="nav-label">MANAGE</p>
        <button className="nav-button" onClick={() => navigate('/team')}>TEAM</button>
        <button className="nav-button" onClick={() => navigate('/projects')}>PROJECTS</button>
      </>
    }

    return (
      <div className="nav-bar">
        <div className="nav-buttons">
            <button className="nav-button" onClick={() => navigate('/dashboard')}>DASHBOARD</button>
            {getManage()}
            <button className="nav-button" onClick={() => AuthService.logout()}>LOGOUT</button>
        </div>
      </div>
    );
  }

