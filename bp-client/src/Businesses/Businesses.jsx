import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./Businesses.css"; 
import axios from "axios"; 
import Card from "../components/Card/card";
import { CiSearch, CiFilter, CiSliderHorizontal } from "react-icons/ci"; 
import { Select } from "../components/Select/Select";
import { Button } from "../components/Button/Button";
import EmptyState from "../components/EmptyState/EmptyState";
import Loading from "../components/Loading/Loading";

export const Business = () => {
    const [businesses, setBusinesses] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 
    const [city, setCity] = useState("Vše");
    const [cities, setCities] = useState([]);
    const [sortOrder, setSortOrder] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false); 
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const sortOptions = [
        { value: "default", label: "Doporučené" },
        { value: "nameAsc", label: "Podle názvu (A-Z)" }
    ];

    const fetchCities = useCallback(async () => {
        try {
            const url = `${API_BASE_URL}/Businesses/cities`;
            const response = await axios.get(url);
            setCities(response.data);
        } catch (err) {
            console.error("Chyba při načítání měst:", err);
        }
    }, [API_BASE_URL]);

    const fetchBusinesses = useCallback(async () => {
        setLoading(true);
        const url = `${API_BASE_URL}/Businesses?searchTerm=${searchTerm}&city=${city}&sortOrder=${sortOrder}&page=${currentPage}&pageSize=15`;
        try {
            const response = await axios.get(url);
            setBusinesses(response.data.items || []); 
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            console.error("Chyba při načítání podniků:", err);
        } finally {
            setLoading(false);
        }
    }, [city, sortOrder, currentPage, API_BASE_URL]);

    useEffect(() => {
        fetchCities();
    }, [fetchCities]);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            setCurrentPage(1); 
            fetchBusinesses();
        }
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

    return (
        <div className="business-page-wrapper">
            <aside className="business-sidebar">
                <div className="sidebar-section">
                    <h3>Hledat</h3>
                    <div className="search-box">
                        <CiSearch 
                            className="search-icon" 
                            onClick={handleSearch} 
                            style={{ cursor: 'pointer' }} 
                        />
                        <input 
                            type="text" 
                            placeholder="Název podniku..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    <Button 
                        text="Hledat" 
                        onClick={handleSearch} 
                        className="search-btn-sidebar"
                    />
                </div>

                <div className="sidebar-section">
                    <h3>Filtrace</h3>
                    <div className="filter-menu">
                        <div className="filter-group">
                            <label><CiFilter /> Město</label>
                            <Select 
                                value={city} 
                                options={cityOptions}
                                onChange={(e) => { 
                                    setCity(e.target.value); 
                                    setCurrentPage(1); 
                                }}
                            />
                        </div>
                        <div className="filter-group">
                            <label><CiSliderHorizontal /> Řazení</label>
                            <Select 
                                value={sortOrder} 
                                options={sortOptions}
                                onChange={(e) => {
                                    setSortOrder(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </aside>
            <main className="business-main-content">
                <h2 className="page-title">Podniky</h2>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="businesses-grid">
                            {businesses.length > 0 ? (
                                businesses.map((b) => (
                                    <Card 
                                        key={b.id}
                                        image={b.imageURL}      
                                        name={b.name}
                                        street={b.street}
                                        houseNumber={b.houseNumber}
                                        city={b.city}
                                        id={b.id}
                                        isVerified={b.isVerified}
                                    />
                                ))
                            ) : (
                                <EmptyState title="Žádné podniky nebyly nalezeny" />
                            )}
                        </div>
                        {businesses.length > 0 && (
                            <div className="pagination">
                                <Button 
                                    disabled={currentPage <= 1} 
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    text="Předchozí"
                                />
                                <span className="pagination-info">
                                    Strana <strong>{currentPage}</strong> z {totalPages}
                                </span>
                                <Button 
                                    disabled={currentPage >= totalPages} 
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    text="Další"
                                />
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};