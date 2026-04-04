import React, { useState, useEffect, useMemo } from "react";
import "./Tips.css";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { TipCard } from "../components/TipCard/TipCard";
import { useAuthContext } from "../Providers/AuthProvider";
import { Select } from "../components/Select/Select";
import { CiSearch } from "react-icons/ci";
import { Button } from "../components/Button/Button";
import EmptyState from "../components/EmptyState/EmptyState";
import Loading from "../components/Loading/Loading";

export const Tips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setError] = useState(null);
  const [state] = useAuthContext(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Vše");
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const isLoggedIn = !!state.accessToken; 

  const categoryOptions = useMemo(() => [
    { value: "Vše", label: "Všechny kategorie" },
    ...categories.map(c => ({ value: c.name, label: c.name }))
  ], [categories]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/Categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error("Chyba kategorií:", err));
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        const url = `${API_BASE_URL}/Tips?searchTerm=${searchTerm}&category=${selectedCategory}&page=${currentPage}&pageSize=9`;
        const response = await axios.get(url);
        setTips(response.data.items || []); 
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error("Chyba při načítání rad:", err);
        setError("Nepodařilo se načíst rady");
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [searchTerm, selectedCategory, currentPage, API_BASE_URL]);

  return (
    <div className="tips-page-wrapper">
      <header className="tips-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Rady a Tipy</h1>
            <p>Zde můžete sdílet své nápady ohledně pěstování a údržby vaší zahrady</p>
          </div>
        </div>
      </header>
      <div className="tips-controls-wrapper">
        <div className="controls-container">
          <div className="controls-left">
            <Select 
              options={categoryOptions}
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="controls-right">
            <div className="search-input-wrapper">
              <CiSearch className="search-icon-small" />
              <input 
                type="text" 
                placeholder="Hledat radu..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
        </div>
      </div>
      <main className={`product-list-container ${loading ? "is-loading" : ""}`}>
        {loading && (
         <Loading message="Načítám tipy..." />
        )}
        <div className="tips-grid">
          {isLoggedIn && (
            <div className="add-tip-card" onClick={() => navigate("/pridat-radu")}>
              <div className="add-icon">+</div>
              <span className="add-text">Přidat novou radu</span>
            </div>
          )}
          {!loading && tips.map((item) => (
            <TipCard key={item.id} tip={item} isOwner={false} />
          ))}
        </div>
        {tips.length === 0 && !loading && (
          <EmptyState
            title="Žádné rady nebyly nalezeny"
          />
        )}
        {totalPages > 1 && (
          <div className="pagination">
            <Button 
              disabled={currentPage <= 1 || loading} 
              onClick={() => setCurrentPage(prev => prev - 1)}
              text="Předchozí"
            />
            <span>Strana {currentPage} z {totalPages}</span>
            <Button 
              disabled={currentPage >= totalPages || loading} 
              onClick={() => setCurrentPage(prev => prev + 1)}
              text="Další"
            />
          </div>
        )}
      </main>
    </div>
  );
};