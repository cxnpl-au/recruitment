export function DeleteButton({ permission, handleClick }) {
  const canDelete = permission == "manage";
  let backgroundColor = canDelete ? "#0067C8" : "grey";

  return (
    <div
      className="deleteButton"
      style={{ backgroundColor: backgroundColor }}
      onClick={
        canDelete
          ? handleClick
          : () => {
              console.log("dont have permission!");
            }
      }
    >
      -
    </div>
  );
}
