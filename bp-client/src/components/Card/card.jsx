import React from "react";
import PropTypes from "prop-types";
import "../Card/card.css";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";

export default function Card({ id, image, name, street, houseNumber, city, owner }) {
  const navigate = useNavigate(); 

  const fullAddress = street && houseNumber 
    ? `${street} ${houseNumber}, ${city}` 
    : "Adresa není uvedena";

  const handleDetailClick = () => {
    navigate(`/podnik/${id}`); 
  };

  return (
    <div className="card">
      {image && (
        <img src={image} alt={name} className="card-image" />
      )}
      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        <p className="card-address">{fullAddress}</p>
        <div className="card-actions">
          <Button text="více" variant="wheat" onClick={handleDetailClick} />
          {owner && (
            <Button 
              text="spravovat" 
              variant="wheat" 
              onClick={() => navigate(`/sprava-podniku/${id}`)} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, 
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
  street: PropTypes.string,
  houseNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  city: PropTypes.string,
};

Card.defaultProps = {
  image: undefined,
  street: "",
  houseNumber: "",
  city: "",
};