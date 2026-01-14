import React from "react";
import PropTypes from "prop-types";
import "../Card/card.css";
import {Button} from "../Button/Button"

export default function Card({ image, name, address, openingHours }) {
  return (
    <div className="card">
      {image && (
        <img src={image} alt={name} className="card-image" />
      )}

      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        <p className="card-address">{address}</p>
        <p className="card-hours">{openingHours}</p>
        <Button text="více" variant="wheat"/>
      </div>
    </div>
  );
}

Card.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
  address: PropTypes.string,
  openingHours: PropTypes.string,
};

Card.defaultProps = {
  image: undefined,
  address: "Adresa není uvedena",
  openingHours: "Otevírací doba není k dispozici",
};