export function DeleteButton({ permission, handleClick }) {
  return (
    <div
      className="deleteButton"
      onClick={
        permission === "manage"
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
