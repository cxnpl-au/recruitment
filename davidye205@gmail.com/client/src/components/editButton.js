export function EditButton({ permission, handleClick }) {
  const canEdit = permission == "write" || permission == "manage";
  return (
    <div
      className="editButton"
      style={{ backgroundColor: !canEdit && "grey" }}
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
