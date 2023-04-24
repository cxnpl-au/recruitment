import { useState, useEffect } from "react";
import { getUsers } from "../api/routes/businessRoutes"
import "../styles/Application.css"

interface User {
  name: string;
  permissions: string
}

export const TeamList = () => {
  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //TODO: Replace id
        const response = await getUsers("id");

        if (!response.ok) {
          throw new Error(
            "Something went wrong while getting team information."
          );
        }

        const users = await response.json();
        setUserData(users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
}, [userData.length])
  
    return (
      <div className="tab-content">
        <h1>Team</h1>
        { userData.map((user: any) => {
          return (
            <div key={user._id} className="team-row">
              <div className="team-col" style={{display: "flex"}}>
                <p className="team-name">{(user.name).toUpperCase()}</p>
                <p>{user.permissions}</p>
              </div>
              <button className="team-col team-button">Show model</button>
            </div>
          )
        }) }
      </div>
    );
  }