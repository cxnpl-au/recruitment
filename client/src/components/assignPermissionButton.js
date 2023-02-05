export function AssignPermissionButton({ permission, handleClick }) {
  return (
    <div
      className="inviteButton"
      onClick={
        permission === "manage"
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
