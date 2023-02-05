import { useState } from "react";

export function EditButton({ permission, handleClick }) {
  return (
    <div
      className="editButton"
      onClick={
        permission === "write" || permission === "manage"
          ? handleClick
          : () => {
              console.log("dont have permission!");
            }
      }
    >
      :
    </div>
  );
}
