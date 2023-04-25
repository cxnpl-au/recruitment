import { useState, useEffect } from "react";
import { getTeam, updateUserPermissions } from "../api/routes/businessRoutes"
import "../styles/Application.css"
import { Nav } from "../components/Nav";

interface User {
  _id: string | undefined,
  name: string | undefined,
  permissions: string| undefined
}

export const TeamRoute = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [userToUpdate, setUserToUpdate] = useState<User>({
    _id: undefined,
    name: undefined,
    permissions: undefined
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //TODO: Replace id
        const response = await getTeam("64478784aec6a10b6ca1e129");

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
    console.log(userToUpdate)
}, [userData.length, userToUpdate]);

const updateUser = async () => {
  try {
    const permissions = {
      permissions: userToUpdate.permissions
    }
    const response = await updateUserPermissions(userToUpdate._id!, permissions)

    if (!response.ok) {
      throw new Error(
        "Something went wrong while updating user permissions"
      );
    }

    setUserToUpdate({
      _id: undefined,
      name: undefined,
      permissions: undefined
    })
  } catch (err) {
    console.error(err);
  }
}
  
  return (
    <div className="application">
        <Nav/>
        <div className="current-tab">
          <div className="tab-content">
              <h1>Team</h1>
              { userData.map((user: any) => {
                return (
                  <div key={user._id} className="team-row">
                    <div className="team-col" style={{display: "flex"}}>
                      <p className="team-name">{(user.name).toUpperCase()}</p>
                      <p>{user.permissions}</p>
                    </div>
                    <button className="team-col team-button" onClick={() => setUserToUpdate(user)}>Update Permissions</button>
                  </div>
                )
              })}
          </div>
        {
          userToUpdate.permissions !== undefined && (
              <form className="team-update-modal">
                <label htmlFor={userToUpdate.permissions} style={{padding: "10px"}}>Choose permission:</label>
                  <select 
                    value={userToUpdate.permissions} 
                    onChange={e => setUserToUpdate({...userToUpdate, permissions: e.target.value})}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="APPROVER">Appover</option>
                    <option value="SUBMITTER">Submitter</option>
                    <option value="NONE">None</option>
                  </select>
                <button className="team-update-button" type="submit" onClick={() => updateUser()}>Update</button>
              </form>
          )
        }
      </div>
    </div>
  );
}