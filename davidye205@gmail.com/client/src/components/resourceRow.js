import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { AssignPermissionButton } from "./assignPermissionButton";
import { EditButton } from "./editButton";

import "../styles/resourceRow.css";
import { DeleteButton } from "./deleteButton";

export function ResourceRow({ resource, deleteResource }) {
  const [userId, setUserId] = useState("");
  const [editable, setEditable] = useState(false);
  const [resourceName, setResourceName] = useState(resource.resourceName);
  const [permissionLevel, setPermissionLevel] = useState("");

  const [expandInvite, setExpandInvite] = useState(false);
  const [expandDelete, setExpandDelete] = useState(false);

  const { user } = useContext(UserContext);

  const handleAssignPermission = async () => {
    try {
      let newResource = await axios({
        // Endpoint to send files
        url: `http://localhost:8080/api/resources/${resource._id}/permissions`,
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
      setExpandInvite(false);
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
      setEditable(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteResource = async () => {
    try {
      let deletedResources = await axios({
        // Endpoint to send files
        url: `http://localhost:8080/api/resources/${resource._id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": user.token,
        },
      });
      console.log(deletedResources);
      setEditable(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserIdInput = (e) => {
    setUserId(e.target.value);
  };
  const handlePermissionLevelInput = (e) => {
    setPermissionLevel(e.target.value);
  };

  const handleResourceNameChange = (e) => {
    setResourceName(e.target.value);
  };

  const handleAssignPermissionClick = () => {
    setExpandInvite(!expandInvite);
  };

  const handleEditClick = () => {
    setEditable(!editable);
  };

  const handleDeleteClick = () => {
    setExpandDelete(!expandDelete);
  };
  const handleConfirmDeleteClick = () => {
    handleDeleteResource();
    deleteResource(resource);
  };

  return (
    <>
      <div className="resourceRow">
        {editable ? (
          <div className="resourceName">
            <input
              className="resourceInput"
              value={resourceName}
              onChange={handleResourceNameChange}
            />
            <button onClick={handleEditResource}>save</button>
          </div>
        ) : (
          <div className="resourceName">{resourceName}</div>
        )}
        <div className="resourceId">{resource._id}</div>
        <div className="ownerId">{resource.ownerId}</div>
        <div className="permissionContainer">
          <div className="permissionLevel">{resource.permission}</div>
          <EditButton
            permission={resource.permission}
            handleClick={handleEditClick}
          />
          <AssignPermissionButton
            permission={resource.permission}
            handleClick={handleAssignPermissionClick}
          />
          <DeleteButton
            permission={resource.permission}
            handleClick={handleDeleteClick}
          />
        </div>
      </div>
      {expandInvite ? (
        <div className="assignPermission">
          <input
            placeholder="userId"
            style={{ marginRight: "10px" }}
            onChange={handleUserIdInput}
          />
          <input
            placeholder="permission level"
            style={{ marginRight: "10px" }}
            onChange={handlePermissionLevelInput}
          />
          <button onClick={handleAssignPermission}>Assign permission</button>
        </div>
      ) : (
        <></>
      )}

      {expandDelete ? (
        <div className="deleteResource">
          <div style={{ marginRight: "10px" }}>
            Are you sure you want to delete?
          </div>
          <button onClick={handleConfirmDeleteClick}>Delete</button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
