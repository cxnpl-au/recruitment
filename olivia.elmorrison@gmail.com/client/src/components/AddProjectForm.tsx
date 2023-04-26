import { createProject } from "../api/routes/businessRoutes";
import "../styles/Application.css"
import { ChangeEvent, useState } from "react";

interface props {
	businessId: string
    setShowCreateProject: any
}

export const AddProjectForm = (props: props) => {

    const [newProject, setNewProject] = useState({
        name: '',
        estimate: 0
    });

    const createNewProject = async () => {
        try {
            const createProjectRequest = {
                name: newProject.name,
                estimate: newProject.estimate
            }
            const response = await createProject(props.businessId, createProjectRequest);
    
            if (!response.ok) {
              throw new Error(
                "Something went wrong while creating projecy"
              );
            }

            props.setShowCreateProject(false);
          } catch (err) {
            console.error(err);
          }
    }
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        let { name, value } = event.target;
        if(name === "estimate"){
            value = value.replace(/\D/g, '');
        }
        setNewProject({ ...newProject, [name]: value });
      };

    return (
    <form className="team-update-modal">
        <h2>Create new project</h2>
        <label htmlFor="projectName">Project Name</label>
        <input value={newProject.name} onChange={handleInputChange} type="text" placeholder="Project Name" id="name" name="name" required/>
        <label htmlFor="projectEstimate">Project Estimate</label>
        <input value={newProject.estimate} onChange={handleInputChange} type="text" placeholder="Project Estimate" id="estimate" name="estimate" required/>
        <button className="team-update-button" type="submit" onClick={() => createNewProject()}>Create</button>
      </form>
    );
  }

