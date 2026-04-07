import React, { useState, useEffect } from "react";
import "./ProductDetail.css"; 
import axios from "axios"; 
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/Button/Button";
import Card from "../components/Card/card";
import { MapComponent } from "../components/Map/Map";
import { TipCard } from "../components/TipCard/TipCard";
import Loading from "../components/Loading/Loading";

export const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [business, setBusiness] = useState(null);
  const [tips, setTips] = useState(null);
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [prodRes, bizRes, tipsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/Products/${id}`),
          axios.get(`${API_BASE_URL}/Businesses/by-product/${id}`),
          axios.get(`${API_BASE_URL}/Products/product/${id}`)
        ]);
        setTips(tipsRes.data)
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
  }, [id, API_BASE_URL]); 

  if (loading) return <Loading />; 
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
                <img src={pImage || "https://res.cloudinary.com/dmzyuywuy/image/upload/v1774028116/i4fo794o2e10b2rawqap.png"} alt={pName} className="detail-image" />
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
            isVerified={business.isVerified}
          />
        </div>
        <div className="address">
          <h3>Kde nás najdete</h3>
          <p>{business.street} {business.houseNumber}, {business.city}</p>
          <div className="map-box">
             <MapComponent lat={business.latitude} 
              lon={business.longitude} 
              businessName={business.name}
              height={300}/>
          </div>
        </div>
      </div>
    )}
  <section className="product-tips-section">
    <div className="section-header">
      <h2 className="section-title">Rady k produktu</h2>
      <div className="title-underline"></div>
    </div>
    {tips && tips.length > 0 ? (
      <div className="product-tips-grid">
        {tips.map((item) => (
          <TipCard 
            key={item.id} 
            tip={item} 
            isOwner={false}
            onUpdate={() => navigate(`/upravit-radu/${item.id}`)}
          />
        ))}
      </div>
    ) : (
      <div className="no-tips-fallback">
        <p>Zatím nebyly přidány žádné rady</p>
      </div>
    )}
    </section>
  </div>
)
};