import React, { useState, useEffect, useMemo } from "react";
import "./Businesses.css"; 
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import Card from "../components/Card/card";
import { useAuthContext } from "../Providers/AuthProvider";
import { CiSearch, CiFilter, CiSliderHorizontal } from "react-icons/ci"; 
import { Select } from "../components/Select/Select";
import { Button } from "../components/Button/Button";

export const Business = () => {
    const [businesses, setBusinesses] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 
    const [city, setCity] = useState("Vše");
    const [cities, setCities] = useState([]);
    const [sortOrder, setSortOrder] = useState("id");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const sortOptions = [
        { value: "default", label: "Doporučené" },
        { value: "nameAsc", label: "Podle názvu (A-Z)" }
    ];

    const fetchBusinesses = () => {
        const url = `https://localhost:7014/api/Businesses?searchTerm=${searchTerm}&city=${city}&sortOrder=${sortOrder}&page=${currentPage}&pageSize=15`;
        axios.get(url)
            .then(response => {
                setBusinesses(response.data.items);
                setTotalPages(response.data.totalPages);
            })
            .catch(err => console.error("Chyba při načítání:", err));
    };

    const fetchCities = () => {
        const url = `https://localhost:7014/api/Businesses/cities`;
        axios.get(url)
            .then(response => {
                setCities(response.data)
            })
            .catch(err => console.error("Chyba při načítání:", err));
    };

    const cityOptions = useMemo(() => {
        const options = cities.map(cityName => ({ 
            value: cityName, 
            label: cityName 
        }));

        return [
            { value: "Vše", label: "Všechna města" },
            ...options
        ];
    }, [cities]);

    useEffect(() => {
        fetchCities(); 
    }, []);

    useEffect(() => {
        fetchBusinesses();
    }, [city, sortOrder, currentPage]);

    const handleSearch = (e) => {
        setCurrentPage(1); 
        fetchBusinesses();
    };

    return (
        <div className="business-page-wrapper">
            <aside className="business-sidebar">
                <div className="sidebar-section">
                    <h3>Hledat</h3>
                    <div className="search-box">
                        <CiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Název" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>
                <div className="sidebar-section">
                    <h3>Filtrace</h3>
                    <div className="filter-menu">
                        <div className="filter-group">
                            <label><CiFilter /> Filtrace</label>
                            <Select 
                                value={city} 
                                options={cityOptions}
                                onChange={(e) => { setCity(e.target.value); setCurrentPage(1); }}/>
                        </div>
                        <div className="filter-group">
                            <label><CiSliderHorizontal /> Řazení</label>
                                <Select 
                                    value={sortOrder} 
                                    options={sortOptions}
                                    onChange={(e) => setSortOrder(e.target.value)}/>
                        </div>
                    </div>
                </div>
            </aside>
            <main className="business-main-content">
                <h2 className="page-title">Podniky</h2>
                <div className="businesses-grid">
                    {businesses.map((b) => (
                        <Card 
                            key={b.id}
                            image={b.imageURL}      
                            name={b.name}
                            street={b.street}
                            houseNumber={b.houseNumber}
                            city={b.city}
                            id={b.id}
                        />
                    ))}
                </div>
                {businesses.length === 0 && <p className="no-results">Žádné podniky nebyly nalezeny</p>}
                <div className="pagination">
                    <Button 
                        disabled={currentPage <= 1} 
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        text="Předchozí"
                    />
                    <span>Strana {currentPage} z {totalPages}</span>
                    <Button 
                        disabled={currentPage >= totalPages} 
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        text="další"
                    />
                </div>
            </main>
        </div>
    );
};