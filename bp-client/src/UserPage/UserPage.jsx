import React, { useState } from "react";
import "./UserPage.css";
import { useAuthContext } from "../Providers/AuthProvider";
import { CiUser, CiLock, CiViewList, CiLight, CiGlobe } from "react-icons/ci"; 
import { MyBusiness } from "../MyBusinesses/MyBusinesses";
import { UserUpdate } from "../UserUpdate/UserUpdate";
import { PasswordReset } from "../components/PasswordReset/PasswordReset";
import { MyTips } from "../MyTips/MyTips";

export const UserPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [state] = useAuthContext(); 
  const userRole = state.profile?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] 
                   || state.profile?.role;
  const isGoogleUser = state.profile?.idp === "Google" || 
                       state.profile?.iss?.includes("google") || 
                       state.profile?.sub?.startsWith("google-oauth2");
  const isBusiness = userRole === "Business";
  const menuItems = [
    { id: "profile", label: "Profil", icon: <CiUser /> },
    ...(isBusiness ? [{ id: "business", label: "Moje podniky", icon: <CiViewList /> }] : []),
    { id: "security", label: "Zabezpečení", icon: <CiLock /> }, 
    { id: "tips", label: "Moje rady", icon: <CiLight /> },
  ];

  return (
    <div className="user-page-container">
      <aside className="side-menu">
        <div className="menu-header">
          <h3>Můj účet</h3>
          <span className="role-badge">{isBusiness ? "Podnikatel" : "Zákazník"}</span>
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
      <main className="user-content fade-in">
        {activeTab === "profile" && <UserUpdate/>}
        {activeTab === "business" && isBusiness && <MyBusiness />}
        {activeTab === "security" && (
          <div className="security-tab-container">
            {isGoogleUser ? (
              <div className="google-info-card">
                <div className="google-header">
                    <CiGlobe size={40} color="#4285F4" />
                    <h4>Externí správa účtu</h4>
                </div>
                <p>Jste přihlášeni přes <strong>Google</strong>.</p>
                <p className="help-text">
                  Vaše heslo je spravováno společností Google. Změnu hesla nebo nastavení dvoufázového ověření můžete provést ve svém Google účtu.
                </p>
                <a 
                  href="https://myaccount.google.com/security" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="google-link-button"
                >
                  Přejít do Google zabezpečení
                </a>
              </div>
            ) : (
              <PasswordReset />
            )}
          </div>
        )}
        {activeTab === "tips" && <MyTips/>}
      </main>
    </div>
  );
};