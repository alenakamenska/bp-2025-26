import React from "react";
import PropTypes from "prop-types";
import "../Card/card.css";
import { Button } from "../Button/Button";

export default function Card({ image, name, street, houseNumber, city }) {
  const fullAddress = street && houseNumber 
    ? `${street} ${houseNumber} ${city}` 
    : "Adresa není uvedena";

  return (
    <div className="card">
      {image && (
        <img src={image} alt={name} className="card-image" />
      )}
      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        <p className="card-address">{fullAddress}</p>
        <div>
            <Button text="více" variant="wheat" />
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
  street: PropTypes.string,
  houseNumber: PropTypes.string,
  openingHours: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

Card.defaultProps = {
  image: undefined,
  street: "",
  houseNumber: "",
  openingHours: "Otevírací doba není k dispozici",
};