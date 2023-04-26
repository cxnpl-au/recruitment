import { useState, useEffect } from "react";
import { getTeam } from "../api/routes/businessRoutes"
import { updateUserPermissions } from "../api/routes/userRoutes";
import "../styles/Application.css"
import { Nav } from "../components/Nav";
import { getBusinessId } from "../authorisation/session.js";
import AuthService from "../authorisation/auth"
import { useNavigate } from "react-router-dom";

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
  const token = AuthService.getToken();
  const businessId = getBusinessId();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getTeam(businessId, token!);

        if (!response.ok) {
          throw new Error(
            "Error when getting team information."
          );
        }

        const users = await response.json();
        setUserData(users);
      } catch (err) {
        console.error(err);
      }
      };
      fetchUsers();
  }, [businessId, token, userData.length]);

const updateUser = async () => {
  try {
    const permissions = {
      permissions: userToUpdate.permissions
    }
    const response = await updateUserPermissions(userToUpdate._id!, permissions, token!)

    if (!response.ok) {
      throw new Error(
        "Error when updating user permissions"
      );
    }

    //reset user
    setUserToUpdate({
      _id: undefined,
      name: undefined,
      permissions: undefined
    })
  } catch (err) {
    console.error(err);
  }
}

const getTabContent = () => {
  return AuthService.isAdminOrApprover() ?
    <div className="tab-content">
        <h1>Team</h1>
        { userData.map((user: any) => {
          return (
            <div key={user._id} className="team-row">
              <div className="team-col" style={{display: "flex"}}>
                <p className="team-name">{(user.name).toUpperCase()}</p>
                <p>{user.permissions}</p>
              </div>
              {AuthService.isAdmin() && <button className="team-col team-button" onClick={() => setUserToUpdate(user)}>Update Permissions</button>}
            </div>
          )
        })}
    </div>
    :
    <div>
    <h1>You dont have any permissions!</h1>
    <h1>Please contact your business admin to add your permissions.</h1>
  </div>
}

if(!AuthService.loggedIn()) {
  return (
    <div className="application">
      <div>
      <div className="current-tab" style={{minWidth: "100vw"}}>
        <h2>You need to log in to view this page.</h2>
        <button className="form-button" onClick={() => navigate('/')}>Please log in</button>
        </div>
      </div>
    </div>
  )
}
  
  return (
    <div className="application">
        <Nav/>
        <div className="current-tab">
        {getTabContent()}
        {
          userToUpdate._id !== undefined && (
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