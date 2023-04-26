import { Nav } from "../components/Nav";
import "../styles/Application.css"
import AuthService from "../authorisation/auth.js";
import { useNavigate } from "react-router-dom";
import { getUserName } from "../authorisation/session";

export const DashboardRoute = () => {
  const navigate = useNavigate();

  const getTabContent = () => {
    return AuthService.hasNoPermissions() ?
      <div>
        <h1>You dont have any permissions!</h1>
        <h1>Please contact your business admin to add your permissions.</h1>
      </div>
      :
    <h1>Hi {getUserName()} !</h1>
  }

  if(!AuthService.loggedIn()) {
    return (
      <div className="application">
        <div>
        <div className="current-tab" style={{minWidth: "100vw"}}>
          <h2>You need to log in to view this page.</h2>
          <button className="form-button" onClick={() => navigate('/')}>Please log in</button>
          </div>
        </div>
      </div>
    )
  }

    return (
      <>
          <div className="application">
          <Nav/>
            <div className="current-tab">
              <div className="tab-content">
                {getTabContent()}
              </div>
            </div>
          </div>
      </>
    );
  }