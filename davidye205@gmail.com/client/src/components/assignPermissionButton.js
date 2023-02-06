export function AssignPermissionButton({ permission, handleClick }) {
  const canAssign = permission == "manage";
  return (
    <div
      className="inviteButton"
      style={{ backgroundColor: !canAssign && "grey" }}
      onClick={
        canAssign
          ? handleClick
          : () => {
              console.log("You dont have permission to assign!");
            }
      }
    >
      +
    </div>
  );
}
