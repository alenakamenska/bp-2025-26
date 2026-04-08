import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./Products.css"; 
import axios from "axios"; 
import { CiSearch, CiFilter, CiSliderHorizontal } from "react-icons/ci"; 
import ProductCard from "../components/ProductCard/ProductCard";
import { Select } from "../components/Select/Select";
import { Button } from "../components/Button/Button";
import EmptyState from "../components/EmptyState/EmptyState";
import Loading from "../components/Loading/Loading";

export const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 
    const [selectedCategory, setSelectedCategory] = useState("Vše");
    const [sortOrder, setSortOrder] = useState("default");
    const [loading, setLoading] = useState(false); 
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const categoryOptions = useMemo(() => [
        { value: "Vše", label: "Všechny kategorie" },
        ...categories.map(c => ({ value: c.name, label: c.name }))
    ], [categories]);

    const sortOptions = [
        { value: "default", label: "Doporučené" },
        { value: "priceAsc", label: "Nejlevnější" },
        { value: "priceDesc", label: "Nejdražší" },
        { value: "nameAsc", label: "Podle názvu (A-Z)" }
    ];

    useEffect(() => {
        axios.get(`${API_BASE_URL}/Categories`)
            .then(res => setCategories(res.data))
            .catch(err => console.error("Chyba kategorií:", err));
    }, [API_BASE_URL]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const url = `${API_BASE_URL}/Products?searchTerm=${searchTerm}&category=${selectedCategory}&sortOrder=${sortOrder}&page=${currentPage}&pageSize=15`;
            const response = await axios.get(url);
            setProducts(response.data.items || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            console.error("Chyba při komunikaci s API:", err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedCategory, sortOrder, currentPage, API_BASE_URL]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
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
                            placeholder="Hledat produkt..." 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>
                <div className="sidebar-section">
                    <h3>Filtrace</h3>
                    <div className="filter-menu">
                        <div className="filter-group">
                            <label><CiFilter /> Kategorie</label>
                            <Select 
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={handleFilterChange(setSelectedCategory)}
                            />
                        </div>
                        <div className="filter-group">
                            <label><CiSliderHorizontal /> Řazení</label>
                            <Select 
                                value={sortOrder} 
                                options={sortOptions}
                                onChange={handleFilterChange(setSortOrder)}
                            />
                        </div>
                    </div>
                </div>
            </aside>
            <main className="business-main-content">
                <header className="business-hero">
                    <div className="hero-overlay">
                        <h1 className="business-hero-title">Nabídka produktů</h1>
                    </div>
                </header>
                <div className="content-container">
                    {loading ? (
                        <div className="status-wrapper">
                            <Loading />
                        </div>
                    ) : (
                        <>
                            {products.length > 0 ? (
                                <div className="results-wrapper">
                                    <div className="businesses-grid">
                                        {products.map((p) => (
                                            <ProductCard
                                                key={p.id}
                                                image={p.imageURL}      
                                                name={p.name}
                                                id={p.id}
                                                price={p.price}
                                                info={p.info}
                                            />
                                        ))}
                                    </div>
                                    {totalPages > 1 && (
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
                                </div>
                            ) : (
                                <div className="status-wrapper">
                                    <EmptyState title="Žádné produkty nebyly nalezeny" />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};