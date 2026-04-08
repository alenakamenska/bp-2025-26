import React, { useState, useEffect, useMemo } from "react";
import "./BusinessDetail.css";
import axios from "axios"; 
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard/ProductCard";
import { MapComponent } from "../components/Map/Map";
import EmptyState from "../components/EmptyState/EmptyState";
import Loading from "../components/Loading/Loading"; // Předpokládám, že máš Loading komponentu

export const BusinessDetail = () => {
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]); 
  const [openingHours, setOpeningHours] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

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
      if (!id) return;
      try {
        setLoading(true);
        const [bizRes, prodRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/Businesses/${id}`),
            axios.get(`${API_BASE_URL}/Products/business/${id}`)
        ]);
        setBusiness(bizRes.data);
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
        try {
          const opRes = await axios.get(`${API_BASE_URL}/OpeningHours/business/${id}`);
          setOpeningHours(opRes.data);
        } catch (e) {
          console.warn("Otevírací hodiny se nepodařilo načíst", e);
          setOpeningHours([]); 
        }
      } catch (err) {
        console.error("Chyba při načítání dat podniku:", err);
        setError("Nepodařilo se načíst data podniku");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, API_BASE_URL]);

  const groupedProducts = useMemo(() => {
    if (!Array.isArray(products)) return {};

    const filtered = products.filter(p =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.reduce((acc, product) => {
      const catName = product.category?.name || "Ostatní";
      if (!acc[catName]) acc[catName] = [];
      acc[catName].push(product);
      return acc;
    }, {});
  }, [products, searchTerm]);

  if (loading) return <Loading />;
  if (error || !business) return <div className="error-container">{error || "Podnik nenalezen"}</div>;

  return (
    <div className="detail-page-wrapper">
      <div className="hero-banner">
        <div className="hero-container">
          <div className="hero-text-side">
            <h1 className="hero-title">{business.name}</h1>
            <p className="hero-subtitle">
              {business.info || "Podívejte se na náš úžasný podnik s rostlinami!"}
            </p>
            <div className="business-contacts">
            {business.owners && business.owners.length > 0 ? (
              business.owners.map((owner, index) => (
                <div key={owner.id || index} className="owner-contact-card">
                  <p className="contact-label">Kontaktní osoba</p>
                  <p><strong>Email:</strong> <a className="mail" href={`mailto:${owner.email}`}>{owner.email}</a></p>
                  {owner.phone && (
                    <p><strong>Telefon:</strong> <a className="phone" href={`tel:${owner.phone}`}>{owner.phone}</a></p>
                  )}
                </div>
              ))
            ) : (
              <p className="no-contact">Kontakt na majitele není k dispozici</p>
            )}
          </div>      
          </div>
          <div className="hero-image-side">
            <div className="image-frame">
              <img 
                src={business.imageURL || "https://res.cloudinary.com/dmzyuywuy/image/upload/v1774030317/wo3twta0gmtgf7y9bsq6.jpg"} 
                alt={business.name} 
              />
            </div>
          </div>
        </div>
      </div>
      <div className="second">
        <div className="opening-hours info-card">
          <h3>Otevírací hodiny</h3>
          <ul className="hours-list">
            {Array.isArray(openingHours) && openingHours.length > 0 ? (
              days.map(day => {
                const hourRecord = openingHours.find(h => 
                  h.day?.trim().toLowerCase() === day.label.toLowerCase()
                );
                return (
                  <li key={day.key} className="hour-item">
                    <strong>{day.label}:</strong> {hourRecord ? (!hourRecord.isClosed
                      ? `${hourRecord.start?.substring(0, 5)} – ${hourRecord.end?.substring(0, 5)}` 
                    : "Zavřeno"
                ) : (
                  <span className="missing-info">Informace chybí</span>
                )}
                  </li>
                );
              })
            ) : (
              <p>Otevírací hodiny nejsou k dispozici</p>
            )}
          </ul>
        </div>
        <div className="info-card">
          <h3>Kde nás najdete</h3>
         {business.street && business.houseNumber && business.city && (
            <p className="address-text">
              {business.street} {business.houseNumber}, {business.city}
            </p>
          )}
          <div className="map-box">
              <MapComponent 
                lat={business.latitude} 
                lon={business.longitude} 
                businessName={business.name}
                height={280}
              />
          </div>
        </div>
      </div>
      <div className="products-section">
        <div className="products-header">
            <h2 className="business-page-title">Produkty v nabídce</h2>
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Hledat produkt nebo kategorii..." 
                    className="detail-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <div className="categories-wrapper">
            {Object.keys(groupedProducts).length > 0 ? (
                Object.keys(groupedProducts).map(category => (
                    <details 
                        key={category} 
                        className="category-accordion" 
                        open={searchTerm.length > 0} 
                    >
                        <summary className="accordion-summary">
                            <span className="cat-title">{category}</span>
                            <span className="cat-count">{groupedProducts[category].length}</span>
                        </summary>
                        <div className="products-grid">
                            {groupedProducts[category].map((p) => (
                                <ProductCard
                                    key={p.id}
                                    image={p.imageURL}      
                                    name={p.name}
                                    id={p.id}
                                    price={p.price}
                                    info={p.info}
                                    category={p.category?.name}
                                />
                            ))}
                        </div>
                    </details>
                ))
            ) : (
                <EmptyState
                  title="Tento podnik nemá v nabídce žádné produkty"
                  message={searchTerm ? "Zkuste hledat jiný výraz" : "Navštivte ho později"}
                />
            )}
        </div>
      </div>
    </div>
  );
};