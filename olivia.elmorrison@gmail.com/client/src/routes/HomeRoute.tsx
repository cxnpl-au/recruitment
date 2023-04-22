import "../styles/Forms.css"
import { useNavigate } from "react-router-dom";

export const HomeRoute = () => {
    const navigate = useNavigate();
  
    return (
      <>
        <h2>Home page</h2>
        <button className="link-button" onClick={() => navigate("/login")}>Go to login</button>
      </>
    );
  }