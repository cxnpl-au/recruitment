export function AssignPermissionButton({ permission, handleClick }) {
  const canAssign = permission == "manage";
  let backgroundColor = canAssign ? "#0067C8" : "grey";
  return (
    <div
      className="inviteButton"
      style={{ backgroundColor: backgroundColor }}
      onClick={
        canAssign
          ? handleClick
          : () => {
              console.log("dont have permission!");
            }
      }
    >
      +
    </div>
  );
}
