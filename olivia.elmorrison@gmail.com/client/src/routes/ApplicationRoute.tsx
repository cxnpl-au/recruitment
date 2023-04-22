import "../styles/Forms.css"
import { useNavigate } from "react-router-dom";

export const ApplicationRoute = () => {
    const navigate = useNavigate();
  
    return (
      <>
        <button className="link-button" onClick={() => navigate("/login")}>back to login</button>
      </>
    );
  }