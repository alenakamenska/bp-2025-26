import React, { useState, useEffect } from "react";
import "./Products.css"; 
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import { useAuthContext } from "../Providers/AuthProvider";
import { CiSearch, CiFilter, CiSliderHorizontal } from "react-icons/ci"; 
import ProductCard from "../components/ProductCard/ProductCard";
import { Select } from "../components/Select/Select";
import { Input } from "../components/Input/Input";

export const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 
    const [selectedCategory, setSelectedCategory] = useState("Vše");
    const [sortOrder, setSortOrder] = useState("default");
    const [loading, setLoading] = useState(false); 
    const categoryOptions = [
        { value: "Vše", label: "Všechny kategorie" },
        ...categories.map(c => ({ value: c.name, label: c.name }))
    ];
    const sortOptions = [
        { value: "default", label: "Doporučené" },
        { value: "priceAsc", label: "Nejlevnější" },
        { value: "priceDesc", label: "Nejdražší" },
        { value: "nameAsc", label: "Podle názvu (A-Z)" }
    ];
    const navigate = useNavigate();
    const [state] = useAuthContext(); 

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get("https://localhost:7014/api/Products", {
                        params: {
                            category: selectedCategory !== "Vše" ? selectedCategory : null,
                            searchTerm: searchTerm || null,
                            sortOrder: sortOrder
                        }
                    }),
                    axios.get("https://localhost:7014/api/Categories") 
                ]);

                setProducts(productsRes.data);
                setCategories(categoriesRes.data); 
            } catch (err) {
                console.error("Chyba při komunikaci s API:", err);
            } finally {
                setLoading(false);
            }
        };
        const delayDebounceFn = setTimeout(() => {
            fetchAllData();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedCategory, sortOrder]);

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
                    <div className="filter-group">
                        <label><CiFilter /> Kategorie</label>
                        <Select 
                            options={categoryOptions}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label><CiSliderHorizontal /> Řazení</label>
                        <Select 
                            value={sortOrder} 
                            options={sortOptions}
                            onChange={(e) => setSortOrder(e.target.value)}
                        />
                    </div>
                </div>
            </aside>
            <main className="business-main-content">
                <h2 className="page-title">Produkty</h2>
                {loading ? (
                    <div className="loading-spinner">Načítám nová data...</div>
                ) : (
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
                )}
                {!loading && products.length === 0 && (
                    <p className="no-results">Pro toto vyhledávání jsme nic nenašli</p>
                )}
            </main>
        </div>
    );
};