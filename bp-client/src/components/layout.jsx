import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import icon from "../images/icon.png";
import "./layout.css";
import { IoMenu } from "react-icons/io5";
import { Footer } from "./footer";

export const FrontLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
