import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { PermissionRow } from "../components/permissionRow";
import { RegisterResource } from "../components/registerResource";
import { UserContext } from "../context/userContext";

function Dashboard() {
  const [resources, setResources] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const { user } = useContext(UserContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (user.token === "") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
    fetchResources();
  }, []);

  const fetchPermissions = () => {
    axios({
      // Endpoint to send files
      url: "http://localhost:8080/api/permissions/",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": user.token,
      },
    })
      // Handle the response from backend here
      .then((res) => {
        setPermissions(res.data);
        console.log("permissions");
        console.log(permissions);
      })

      // Catch errors if any
      .catch((err) => {
        console.log(err);
      });
  };

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
    setResources(resources.concat(newResource));
  };

  return (
    <div>
      {user && <RegisterResource addResource={addResource} />}
      <h1>Resources</h1>
      {resources.map((resource) => {
        return <PermissionRow key={resource._id} resource={resource} />;
      })}
      <h1>Roles</h1>
      {permissions.map((permission) => {
        return (
          <div>
            {permission.resourceId}
            ---------------------------------------------------------------------------------------
            {permission.permission}
          </div>
        );
      })}
    </div>
  );
}

export default Dashboard;
