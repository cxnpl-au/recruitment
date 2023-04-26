import { ChangeEvent, useEffect, useState } from "react";
import { Nav } from "../components/Nav";
import "../styles/Application.css"
import { getProjects, updateProject } from "../api/routes/businessRoutes";
import { AddProjectForm } from "../components/AddProjectForm";

export interface Project {
  _id?: string | undefined,
  name: string | undefined,
  estimate: number | undefined,
  expense: number | undefined,
  estimatedProfit: number | undefined
}

export const ProjectsRoute = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [projectToUpdate, setProjectToUpdate] = useState<Project>({
    _id: undefined,
    name: undefined,
    estimate: undefined,
    expense: undefined,
    estimatedProfit: undefined
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        //TODO: Replace id
        const response = await getProjects("6448cf3ab93ab700ad54981f");

        if (!response.ok) {
          throw new Error(
            "Something went wrong while getting team information."
          );
        }

        let projects = await response.json();
        projects = projects.map((project: any) => {
          return {
            ...project,
            estimatedProfit: project.estimate - project.expense || 0
          }
        })

        setProjectsData(projects);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, [projectsData.length]);

  const sendUpdateProject = async () => {
    try {
      const request = {
        estimate: projectToUpdate.estimate,
        expense: projectToUpdate.expense
      }
      const response = await updateProject("6448cf3ab93ab700ad54981f", projectToUpdate._id!, request);
  
      console.log(response);
      if (!response.ok) {
        throw new Error(
          "Something went wrong while updating project"
        );
      }
  
      //reset project
      setProjectToUpdate({
        _id: undefined,
        name: undefined,
        estimate: undefined,
        expense: undefined,
        estimatedProfit: undefined
      })
    } catch (err) {
      console.error(err);
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const resultNumber = value.replace(/\D/g, '');
    const newProject = { ...projectToUpdate, [name]: resultNumber };
    const projectEstimate = newProject.estimate! - newProject.expense!;

    setProjectToUpdate({
      ...newProject, 
      estimatedProfit: projectEstimate
    });
  };
  
    return (
      <div className="application">
        <Nav/>
        <div className="current-tab">
        <div className="tab-content">
              <div className="team-row" style={{backgroundColor: "transparent"}}>
                <h1>Projects</h1>
                <button className="team-button" style={{minHeight: "40px"}} onClick={() => setShowCreateProject(true)}>Add project</button>
              </div>
              { projectsData.map((project: any) => {
                return (
                  <div key={project._id} className="team-row">
                    <div className="team-col" style={{display: "flex"}}>
                      <p className="team-name">{(project.name).toUpperCase()}</p>
                    </div>
                    <button className="team-col team-button" onClick={() => setProjectToUpdate(project)}>Update Project</button>
                  </div>
                )
              })};
          </div>
          {
          projectToUpdate._id !== undefined && (
            <form className="team-update-modal">
              <h2 style={{padding: "10px"}}>{projectToUpdate.name}</h2>
              <label htmlFor="estimate">Estimate</label>
              <input value={projectToUpdate.estimate} onChange={handleInputChange} type="text" placeholder="Estimated cost" id="estimate" name="estimate"/>
              <label htmlFor="expense">Expense</label>
              <input value={projectToUpdate.expense} onChange={handleInputChange} type="text" placeholder="Expenses accumulated so far" id="expense" name="expense"/>
              <label htmlFor="estimated-profit">Estimated Profit</label>
              <p>{projectToUpdate.estimatedProfit}</p>
            <button className="team-update-button" type="submit" onClick={() => sendUpdateProject()}>Update</button>
          </form>
        )}
        {(showCreateProject &&<AddProjectForm businessId={"6448cf3ab93ab700ad54981f"} setShowCreateProject={setShowCreateProject} />)}
        </div>
      </div>
    );
  }