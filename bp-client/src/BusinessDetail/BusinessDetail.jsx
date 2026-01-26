import React, { useState, useEffect } from "react";
import "./BusinessDetail.css";
import axios from "axios"; 
import { useParams } from "react-router-dom";


export const BusinessDetail = () => {
  const [business, setBusiness] = useState(null);
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hours, setHours] = useState([]);

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
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://localhost:7014/api/Businesses/${id}`);
        setBusiness(response.data);
      } catch (err) {
        setError("Nepodařilo se načíst detail podniku");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBusiness();
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
            {days.map(day => (
              <li key={day.key}>
                <strong>{day.label}:</strong> {business[day.key] || "Zavřeno"}
              </li>
            ))}
          </ul>
        </div>

        <div className="address info-card">
          <h3>Kde nás najdete</h3>
          <p>{business.street} {business.houseNumber}, {business.city}</p>
          <div className="map-box">
             <p style={{fontStyle: 'italic'}}>Mapa se načítá podle adresy...</p>
          </div>
        </div>
      </div>
    </div>
  );
};