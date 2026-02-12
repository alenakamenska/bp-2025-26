import React, { useState, useEffect } from "react";
import "./ProductDetail.css";
import axios from "axios"; 
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/Button/Button";
import Card from "../components/Card/card";
import { MapComponent } from "../components/Map/Map";

export const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [business, setBusiness] = useState(null);
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [prodRes, bizRes] = await Promise.all([
          axios.get(`https://localhost:7014/api/Products/${id}`),
          axios.get(`https://localhost:7014/api/Businesses/by-product/${id}`)
        ]);
        
        setProduct(prodRes.data);
        setBusiness(bizRes.data);
      } catch (err) {
        console.error("Chyba při načítání:", err);
        setError("Nepodařilo se načíst data o produktu nebo prodejci");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllData();
  }, [id]); 

  if (loading) return <div className="loading-container">Načítám zahradní poklad...</div>;
  if (error || !product) return <div className="error-container">{error}</div>;

  const pName = product.name || product.Name;
  const pInfo = product.info || product.Info;
  const pPrice = product.price || product.Price;
  const pImage = product.imageURL || product.ImageURL;
  const pCategory = product.category?.name || product.Category?.Name;

  return (
  <div className="product-detail-page">
    <div className="detail-main-content"> 
        <div className="product-detail-container">
            <div className="product-detail-left">
                <img src={pImage} alt={pName} className="detail-image" />
            </div>
            <div className="product-detail-right">
                <span className="detail-category">{pCategory}</span>
                <h1 className="detail-title">{pName}</h1>
                <div className="detail-description">
                <h3>O produktu</h3>
                <p>{pInfo}</p>
                </div>
            </div>
        </div>
        <div className="detail-actions">
            <Button text="← Zpět do nabídky" variant="wheat" onClick={() => navigate(-1)} />
            <div className="detail-price">{pPrice} Kč</div>
        </div>
    </div>
    <h2 className="seller-title">Kde tento produkt koupíte?</h2>
    {business && (
      <div className="seller-section">
        <div className="seller-card-wrapper">
          <Card
            id={business.id}
            name={business.name}
            image={business.imageURL}
            street={business.street}
            houseNumber={business.houseNumber}
            city={business.city}
            owner={false} 
          />
        </div>
        <div className="address">
          <h3>Kde nás najdete</h3>
          <p>{business.street} {business.houseNumber}, {business.city}</p>
          <div className="map-box">
             <MapComponent lat={business.latitude} 
              lon={business.longitude} 
              businessName={business.name}
              height={180}/>
          </div>
        </div>
      </div>
    )}
  </div>
)
};