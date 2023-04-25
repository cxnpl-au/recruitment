import { Nav } from "../components/Nav";
import "../styles/Application.css"

export const DashboardRoute = () => {
    return (
      <>
        <div className="application">
        <Nav/>
          <div className="current-tab">
            <div className="tab-content">
              <h1>Dashboard</h1>
            </div>
          </div>
        </div>
      </>
    );
  }