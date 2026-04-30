import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import icon from "../images/icon.png";
import "./layout.css";
import { IoMenu } from "react-icons/io5";
import { Footer } from "./footer";
import IconButton from "./iconButton"; 
import { CiCircleInfo, CiLogin, CiLogout, CiUser } from "react-icons/ci";
import { useAuthContext } from "../Providers/AuthProvider";

export const FrontLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, dispatch] = useAuthContext();  
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            label={isLoggedIn ? "Odhlásit se" : "Přihlásit se"}
          />
          <IconButton 
            icon={isLoggedIn ? CiCircleInfo : CiUser} 
            color="#fff" 
            onClick={() => {isLoggedIn ? navigate("/uzivatel") : navigate("/register")}}   
            label={isLoggedIn ? "Správa profilu" : "Registrace"}      
          />
        </div>
      </nav>
      <main className="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};