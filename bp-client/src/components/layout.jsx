import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import icon from "../images/icon.png";
import "./layout.css";
import { IoMenu } from "react-icons/io5";
import { Footer } from "./footer";
import IconButton from "./iconButton"; 
import { CiLogin, CiLogout, CiUser } from "react-icons/ci";
import { useAuthContext } from "../Providers/AuthProvider";

export const FrontLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, dispatch] = useAuthContext();  
  const userRole = state.profile?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const isLoggedIn = !!state.accessToken;  
  const navigate = useNavigate();
  const handleAuthAction = () => {
    if (isLoggedIn) {
      dispatch({ type: "CLEAR_ACCESS_TOKEN" }); 
      localStorage.removeItem("token"); 
      navigate("/logout");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="navbar">
        <img src={icon} alt="Logo" className="icon" />
        
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <IoMenu/>
        </button>

        <ul className={`nav-list ${isOpen ? "open" : ""}`}>
          <li className="nav-item"><Link to="/">Domů</Link></li>
          <li className="nav-item"><Link to="/podniky">Podniky</Link></li>
          <li className="nav-item"><Link to="/sortiment">Sortiment</Link></li>
          <li className="nav-item"><Link to="/rady">Rady</Link></li>
        </ul>
        <div className="nav-icons">
          <IconButton 
          icon={isLoggedIn ? CiLogout : CiLogin} 
          color="#fff" 
          onClick={handleAuthAction}
        />
        <IconButton 
          icon={CiUser} 
          color="#fff" 
          onClick={() => navigate("/register")}        
          />
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};