import React, { useState, useEffect } from "react";
import "./BusinessDetail.css";
import axios from "axios"; 
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard/ProductCard";

export const BusinessDetail = () => {
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]); 
  const [openingHours, setOpeningHours] = useState([])
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const days = [
    { key: 'pondeli', label: 'Pondělí' },
    { key: 'utery', label: 'Úterý' },
    { key: 'streda', label: 'Středa' },
    { key: 'ctvrtek', label: 'Čtvrtek' },
    { key: 'patek', label: 'Pátek' },
    { key: 'sobota', label: 'Sobota' },
    { key: 'nedele', label: 'Neděle' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const bizRes = await axios.get(`https://localhost:7014/api/Businesses/${id}`);
        setBusiness(bizRes.data);
        const prodRes = await axios.get(`https://localhost:7014/api/Products/business/${id}`);
        setProducts(prodRes.data);
        try {
        const opRes = await axios.get(`https://localhost:7014/api/OpeningHours/business/${id}`);
        setOpeningHours(opRes.data);
        } catch (e) {
          console.warn("Otevírací hodiny nenalezeny", e);
          setOpeningHours([]); 
        }
      } catch (err) {
        console.error("Chyba při načítání:", err);
        setError("Nepodařilo se načíst data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]); 

  if (loading) return <div className="loading">Načítám...</div>;
  if (error || !business) return <div className="error">{error}</div>;

  return (
    <div className="detail-page-wrapper">
      <div className="first" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.5)), url(${business.imageURL})` }}>
        <div className="hero-content">
            <h2>{business.name}</h2>
            <p>{business.info}</p>
        </div>
      </div>
      <div className="second">
        <div className="opening-hours info-card">
          <h3>Otevírací hodiny</h3>
          <ul>
            {Array.isArray(openingHours) && openingHours.length > 0 ? (
              days.map(day => {
                const hourRecord = openingHours.find(h => 
                  h.day.trim().toLowerCase() === day.label.toLowerCase()
                );
                return (
                  <li key={day.key}>
                    <strong>{day.label}:</strong> {hourRecord 
                      ? `${hourRecord.start.substring(0, 5)} – ${hourRecord.end.substring(0, 5)}` 
                      : "Zavřeno"}
                  </li>
                );
              })
            ) : (
              <p>Otevírací hodiny nejsou k dispozici</p>
            )}
          </ul>
        </div>
        <div className="address info-card">
          <h3>Kde nás najdete</h3>
          <p>{business.street} {business.houseNumber}, {business.city}</p>
          <div className="map-box">
             <p style={{fontStyle: 'italic'}}>Mapa se načítá podle souřadnic...</p>
          </div>
        </div>
      </div>

      <h2 className="page-title">Produkty v nabídce</h2>
      <div className="businesses-grid">
          {products && products.length > 0 ? (
              products.map((p) => (
                  <ProductCard
                      key={p.id}
                      image={p.imageURL}      
                      name={p.name}
                      id={p.id}
                      price={p.price}
                      info={p.info}
                      category={p.category?.name}
                  />
              ))
          ) : (
              <p className="no-products">Tento podnik zatím nemá v nabídce žádné produkty.</p>
          )}
      </div>
    </div>
  );
};