import React from "react";
import { CiLock } from "react-icons/ci";

export const Unauthorize = () => {
    return (
        <div className="logout-container">
            <div className="jumbotron">
                <CiLock size={100} style={{ color: "var(--secondary-color)" }} />                
                <h3 className="logout">Nemáte oprávnění vstoupit na stránku</h3>
            </div>
        </div>
    );
};