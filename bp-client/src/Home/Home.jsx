import React from "react";
import image from "../images/main.jpg";
import "./home.css";

export const Home = () => {
  const welcomeMessage = "Vítej na hlavní stránce!";
  return (
    <div>
      <div className="banner">
        <img src={image} alt="Banner" className="banner-image" />
      </div>
      <div className="banner-text">
        <h1>Vítejte v portále pro zahradnictví a květinářství</h1>
      </div>
      <div>
        <h2 className="danger">Výstrahy</h2>
        <div className="container">
            <p>Přikryjte rajčata teplota v následujících hodinách klesne pod 6°C</p>
        </div>
      </div>
      <div>
        <h2>Naše zahradnictví</h2>
      </div>
    </div>
  );
};
