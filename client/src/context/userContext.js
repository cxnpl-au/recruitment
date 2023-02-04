import React, { createContext, useState } from "react";

//create content
export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState({ token: "" });

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
