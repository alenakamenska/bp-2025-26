import React, { useState, useEffect } from "react";
import image from "../images/main.jpg";
import image1 from "../images/form1.jpg";
import image2 from "../images/oprava.jpg"
import "./home.css";
import Card from "../components/Card/card";
import ProductCard from "../components/ProductCard/ProductCard"; 
import Warning from "../components/Warning/warning";
import axios from "axios";
import EmptyState from "../components/EmptyState/EmptyState";
import Loading from "../components/Loading/Loading";

export const Home = () => {
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
       const [businessesRes, productsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/Businesses?pageSize=3`),
          axios.get(`${API_BASE_URL}/Products?pageSize=3`)
        ]);   
        setBusinesses(businessesRes.data.items || businessesRes.data);
        setProducts(productsRes.data.items || productsRes.data);
      } catch (err) {
        console.error("Chyba při hromadném načítání dat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-wrapper">
      <div className="banner">
        <img src={image} alt="Banner" className="banner-image" />
      </div>
      <div className="banner-text">
        <h1>Vítejte v portále pro zahradnictví a květinářství</h1>
      </div>
      <div className="container">
        <Warning />
        <div className="home-grid">
          <div className="home-info-card">
            <img src={image1} alt="Produkty" />
            <div className="info-content">
              <h3>Rostliny</h3>
              <p>Vyberte si ze široké nabídky rostlin z vašeho okolí</p>
            </div>
          </div>
          <div className="home-info-card">
            <img src={image2} alt="Podniky" />
            <div className="info-content">
              <h3>Podniky</h3>
              <p>Objevte zajímavé podniky blízko vás</p>
            </div>
          </div>
          <div className="home-info-card">
            <img src={image} alt="Rady a tipy" />
            <div className="info-content">
              <h3>Rady a Tipy</h3>
              <p>Inspirujte se nejnovějšími radami od odborníků i veřejnosti</p>
            </div>
          </div>
        </div>
         <div className="parallax-divider">
          <div className="parallax-content">
            <h3>Podniky</h3>
          </div>
        </div>
        <section className="about-section">
          <div className="about-content">
            <div className="about-text">
              <h2>O portále</h2>
              <p>
                Portál slouží podnikům k jednoduché propagaci sortimentu. 
                Pouhým vyplněním formuláře získají stránku s informacemi o svém podniku.
                Návštěvníci je pak mohou jednoduše najít včetně sortimentu.
              </p>
            </div>
            <div className="about-benefits">
              <div className="benefit-item">
                <h4>Proč se k nám přidat?</h4>
                <ul>
                  <li>Seznamte s podnikem lidi ze svého okolí</li>
                  <li>Vytvořte si stránku s podnikem pouze vyplněním formuláře</li>
                  <li>Sdílejte rady a tipy s ostatními</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="home-section">
          <h2>Přidané podniky</h2>
          {loading ? (
            <Loading/>
          ) : (
            <div className="home-grid">
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
                <EmptyState
                  title="Zatím nebyly přidány žádné podniky"
                  message="Buďte první"
                />
              )}
            </div>
          )}
        </section>
        <div className="parallax-divider">
          <div className="parallax-content">
            <h3>Kvalitní nástroje pro váš koníček</h3>
          </div>
        </div>
        <section className="home-section-products">
          <h2>Přidané produkty</h2>
          {loading ? (
            <Loading/>
          ) : (
            <div className="home-grid">
              {products.length > 0 ? (
                products.map((p) => (
                  <ProductCard 
                    key={p.id}
                    image={p.imageURL}      
                    name={p.name}
                    price={p.price}
                    id={p.id}
                    info={p.info}
                  />
                ))
              ) : (
                <EmptyState
                  title="Zatím nebyly přidány žádné produkty"
                  message="Buďte první"
                />
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};