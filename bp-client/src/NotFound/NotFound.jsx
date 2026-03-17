import React from "react";
import { CiNoWaitingSign } from "react-icons/ci";

export const NotFound = () => {
    return (
        <div className="logout-container">
            <div className="jumbotron">
                <CiNoWaitingSign size={100} style={{ color: "var(--secondary-color)" }} />                
                <h3 className="logout">Stránka nebyla nalezena</h3>
            </div>
        </div>
    );
};