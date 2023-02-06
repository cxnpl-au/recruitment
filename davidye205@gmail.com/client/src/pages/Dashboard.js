import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { RegisterResource } from "../components/registerResource";
import { UserContext } from "../context/userContext";
import { ResourceRow } from "../components/resourceRow";
import { ResourceRowHeader } from "../components/resourceRowHeader";

function Dashboard() {
  const [resources, setResources] = useState([]);

  const { user } = useContext(UserContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (user.token == "") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, []);
  const fetchResources = () => {
    axios({
      // Endpoint to send files
      url: "http://localhost:8080/api/resources/",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": user.token,
      },
    })
      // Handle the response from backend here
      .then((res) => {
        setResources(res.data);
        console.log("resources");
        console.log(resources);
      })

      // Catch errors if any
      .catch((err) => {
        console.log(err);
      });
  };

  const addResource = (newResource) => {
    setResources([...resources, newResource]);
  };

  const deleteResource = (deletedResource) => {
    console.log(resources);
    let filteredResources = resources.filter(
      (resource) => resource._id == deletedResource._id
    );
    console.log("filtered resources");
    console.log(filteredResources);

    setResources(
      resources.filter((resource) => resource._id != deletedResource._id)
    );
  };

  return (
    <div>
      {user && <RegisterResource addResource={addResource} />}
      <h1>Resources</h1>
      <ResourceRowHeader />
      {resources.map((resource) => {
        return (
          <div>
            <ResourceRow
              key={resource._id}
              resource={resource}
              deleteResource={deleteResource}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Dashboard;
