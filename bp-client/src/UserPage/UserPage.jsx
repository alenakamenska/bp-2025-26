import React, { useState } from "react";
import "./UserPage.css";
import { useAuthContext } from "../Providers/AuthProvider";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { CiUser, CiLock, CiViewList, CiLogout } from "react-icons/ci";

export const UserPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { logout } = useAuthContext(); 

  const menuItems = [
    { id: "profile", label: "Profil", icon: <CiUser /> },
    { id: "orders", label: "Moje podniky", icon: <CiViewList /> },
    { id: "security", label: "Změna hesla", icon: <CiLock /> },
  ];

  return (
    <div className="user-page-container">
      <aside className="side-menu">
        <div className="menu-header">
          <h3>Můj účet</h3>
        </div>
        <nav className="menu-items">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="user-content">
        {activeTab === "profile" && <h1>Nastavení profilu</h1>}
        {activeTab === "orders" && <h1>Moje </h1>}
        {activeTab === "security" && <h1>Změna hesla</h1>}
      </main>
    </div>
  );
};