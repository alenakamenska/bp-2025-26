import React, { useState } from "react";
import "./UserPage.css";
import { useAuthContext } from "../Providers/AuthProvider";
import { CiUser, CiLock, CiViewList, CiLogout } from "react-icons/ci";
import { MyBusiness } from "../MyBusinesses/MyBusinesses";
import { UserUpdate } from "../UserUpdate/UserUpdate";

export const UserPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [state] = useAuthContext(); 

  const userRole = state.profile?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] 
                   || state.profile?.role;

  const isBusiness = userRole === "Business";
  const menuItems = [
    { id: "profile", label: "Profil", icon: <CiUser /> },
    ...(isBusiness ? [{ id: "business", label: "Moje podniky", icon: <CiViewList /> }] : []),
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
        {activeTab === "profile" && <UserUpdate/>}
        {activeTab === "business" && isBusiness && <MyBusiness />}
        {activeTab === "security" && <h1>Změna hesla</h1>}
      </main>
    </div>
  );
};