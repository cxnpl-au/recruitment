import { useState } from "react";
import { TAB } from "../helpers/constants";
import { Projects } from "../components/Projects"
import { TeamList } from "../components/TeamList"
import { Dashboard } from "../components/Dashboard";
import "../styles/Application.css"

export const ApplicationRoute = () => {
  const [currentTab, setCurrentTab] = useState(TAB.DASHBOARD);

  const getNav = () => {
    return (
      <div className="nav-bar">
        <div className="nav-buttons">
            <button className="nav-button" onClick={() => setCurrentTab(TAB.DASHBOARD)}>DASHBOARD</button>
            <p className="nav-label">MANAGE</p>
            <button className="nav-button" onClick={() => setCurrentTab(TAB.TEAM)}>TEAM</button>
            <button className="nav-button" onClick={() => setCurrentTab(TAB.PROJECTS)}>PROJECTS</button>
        </div>
      </div>
    );
  }

  const getCurrentTab = () => {
    switch(currentTab) {
      case (TAB.DASHBOARD):
        return <Dashboard/>
      case (TAB.TEAM):
        return <TeamList/>
      case (TAB.PROJECTS):
        return <Projects/>
      default:
        return <Dashboard/>
    }
  }
    return (
      <>
      <div className="application">
        {getNav()}
        <div className="current-tab">
          {getCurrentTab()}
        </div>
      </div>
      </>
    );
  }

