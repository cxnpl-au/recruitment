import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";

import "../styles/resourceRow.css";
import { AssignPermissionButton } from "./assignPermissionButton";
import { EditButton } from "./editButton";

export function ResourceRow({ resource }) {
  const [userId, setUserId] = useState("");
  const [editable, setEditable] = useState(false);
  const [resourceName, setResourceName] = useState(resource.resourceName);
  const [permissionLevel, setPermissionLevel] = useState("");

  const [expandInvite, setExpandInvite] = useState(false);
  const { user } = useContext(UserContext);
  const handleAssignPermission = async () => {
    try {
      let newResource = await axios({
        // Endpoint to send files
        url: `http://localhost:8080/api/permissions/${resource._id}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": user.token,
        },
        data: {
          userId: userId,
          permission: permissionLevel,
        },
      });
      console.log(newResource);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditResource = async () => {
    try {
      let newResource = await axios({
        // Endpoint to send files
        url: `http://localhost:8080/api/resources/${resource._id}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": user.token,
        },
        data: {
          resourceName: resourceName,
        },
      });
      console.log(newResource);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserIdInput = (e) => {
    setUserId(e.target.value);
    console.log(userId);
  };
  const handlePermissionLevelInput = (e) => {
    setPermissionLevel(e.target.value);
    console.log(permissionLevel);
  };

  const handleAssignPermissionClick = () => {
    setExpandInvite(!expandInvite);
  };

  const handleResourceNameChange = (e) => {
    setResourceName(e.target.value);
  };

  const handleEditClick = () => {
    setEditable(!editable);
  };

  return (
    <>
      <div className="permissionRow">
        <div className="resourceId">{resource._id}</div>
        {editable ? (
          <div className="resourceName">
            <input value={resourceName} onChange={handleResourceNameChange} />
            <button onClick={handleEditResource}>save</button>
          </div>
        ) : (
          <div className="resourceName">{resourceName}</div>
        )}
        <div className="ownerId">{resource.ownerId}</div>
        <div className="permissionLevel">{resource.permission}</div>
        <EditButton
          permission={resource.permission}
          handleClick={handleEditClick}
        />
        <AssignPermissionButton
          permission={resource.permission}
          handleClick={handleAssignPermissionClick}
        />
      </div>
      {expandInvite ? (
        <div className="permissionRow">
          <input placeholder="userId" onChange={handleUserIdInput} />
          <input
            placeholder="permission level"
            onChange={handlePermissionLevelInput}
          />
          <button onClick={handleAssignPermission}>Assign permission</button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
