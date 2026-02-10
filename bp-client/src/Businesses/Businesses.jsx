import React, { useState, useEffect } from "react";
import "./Businesses.css"; 
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import Card from "../components/Card/card";
import { useAuthContext } from "../Providers/AuthProvider";
import { CiSearch, CiFilter, CiSliderHorizontal } from "react-icons/ci"; 

export const Business = () => {
    const [businesses, setBusinesses] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 
    const navigate = useNavigate();
    const [state] = useAuthContext(); 

    useEffect(() => {
        axios.get("https://localhost:7014/api/Businesses")
        .then(response => {
            setBusinesses(response.data);
        })
        .catch(err => console.error("Chyba při načítání:", err));
    }, []);

    return (
        <div className="business-page-wrapper">
            
            <aside className="business-sidebar">
                <div className="sidebar-section">
                    <h3>Hledat</h3>
                    <div className="search-box">
                        <CiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Název podniku..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="sidebar-section">
                    <h3>Filtrace</h3>
                    <div className="placeholder-menu">
                        <button className="filter-item-disabled"><CiFilter /> Kategorie</button>
                        <button className="filter-item-disabled"><CiSliderHorizontal /> Řazení</button>
                    </div>
                    <p className="hint-text">Další funkce připravujeme...</p>
                </div>
            </aside>

            <main className="business-main-content">
                <h2 className="page-title">Podniky</h2>
                <div className="businesses-grid">
                    {businesses
                        .filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((b) => (
                            <Card 
                                key={b.id}
                                image={b.imageURL}      
                                name={b.name}
                                street={b.street}
                                houseNumber={b.houseNumber}
                                city={b.city}
                                id = {b.id}
                            />
                        ))
                    }
                </div>
                {businesses.length === 0 && <p>Žádné podniky nebyly nalezeny.</p>}
            </main>
        </div>
    );
};