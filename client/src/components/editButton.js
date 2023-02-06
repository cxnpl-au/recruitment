export function EditButton({ permission, handleClick }) {
  const canEdit = permission === "write" || permission === "manage";
  let backgroundColor = canEdit ? "#0067C8" : "grey";
  return (
    <div
      className="editButton"
      style={{ backgroundColor: backgroundColor }}
      onClick={
        canEdit
          ? handleClick
          : () => {
              console.log("You dont have permission to edit!");
            }
      }
    >
      :
    </div>
  );
}
