import "../styles/permissionRow.css";
import axios from "axios";

export function PermissionRow({ resource }) {
  return (
    <div className="permissionRow">
      <div className="resourceName">{resource.resourceName}</div>
      <div className="ownerId">{resource.ownerId}</div>
      <div className="permissionLevel">permission</div>
    </div>
  );
}
