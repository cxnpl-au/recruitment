import "../styles/resourceRowHeader.css";

export function ResourceRowHeader() {
  return (
    <>
      <div className="headerRow">
        <div className="resourceNameHeader">Resource Name</div>
        <div className="resourceIdHeader">Resource Id</div>
        <div className="ownerIdHeader">OwnerId</div>
        <div className="permissionLevelHeader">Permission</div>
      </div>
    </>
  );
}
