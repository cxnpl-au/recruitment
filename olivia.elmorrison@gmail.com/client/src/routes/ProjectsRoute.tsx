import { Nav } from "../components/Nav";
import "../styles/Application.css"

export const ProjectsRoute = () => {
  
    return (
      <div className="application">
        <Nav/>
        <div className="current-tab">
          <div className="tab-content">
            <h1>Projects</h1>
          </div>
        </div>
      </div>
    );
  }