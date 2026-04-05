import React from "react";
import "./Logout.css";
import { CiLogout } from "react-icons/ci";

export const Logout = () => {
    return (
        <div className="logout-container">
            <div className="jumbotron">
                <CiLogout size={100} style={{ color: "var(--secondary-color)" }} />                
                <h3 className="logout">Odhlášení proběhlo úspěšně</h3>
            </div>
        </div>
    );
};