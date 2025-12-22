import React from "react";
import image from "../images/main.jpg";
import img from "../images/oprava.jpg"
import "./home.css";
import Card from "../components/Card/card"
import Warning from "../components/Warning/warning"

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
        <Warning />
      </div>
      <div className="container">
        <h2>Naše zahradnictví</h2>
        <div className="busines">
          <Card image={image} name="zahradnictví Raspenava" address="Raspenava" openingHours="Po-So: 10-17"/>
          <Card image={img} name="zahradnictví Raspenava" address="Raspenava" openingHours="Po-So: 10-17"/>
          <Card image={image} name="zahradnictví Raspenava" address="Raspenava" openingHours="Po-So: 10-17"/>
          <Card image={img} name="zahradnictví Raspenava" address="Raspenava" openingHours="Po-So: 10-17"/>
        </div>
      </div>
    </div>
  );
};
