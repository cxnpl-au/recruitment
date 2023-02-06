export function DeleteButton({ permission, handleClick }) {
  const canDelete = permission == "manage";
  return (
    <div
      className="deleteButton"
      style={{ backgroundColor: !canDelete && "grey" }}
      onClick={
        canDelete
          ? handleClick
          : () => {
              console.log("You dont have permission to delete!");
            }
      }
    >
      -
    </div>
  );
}
