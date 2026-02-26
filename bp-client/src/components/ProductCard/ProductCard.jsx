import React from "react";
import PropTypes from "prop-types";
import "../ProductCard/ProductCard.css";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ id, image, name, price, info, isOwner, onDelete, onUpdate}) {
  const navigate = useNavigate(); 
  const handleDetailClick = () => {
    navigate(`/produkt/${id}`); 
  };

  const handleDelete = () =>{
        onDelete(id);
  }

  const handleUpdate = () =>{
        onUpdate(id);
  }

  return (
    <div className="product-card">
      {image && (
        <img src={image} alt={name} className="product-card-image" />
      )}
      <div className="product-card-body">
        <h3 className="product-card-title">{name}</h3>
        <p className="product-info">{info}</p>
        <div className="product-card-footer">
          <Button text="více" variant="primary" onClick={handleDetailClick} />
            <p className="product-card-price">{price} Kč</p>
        </div>
          {isOwner &&(
            <div className="product-card-footer">
              <Button text="smazat" variant="danger" onClick={handleDelete} />
              <Button text="upravit" variant="secondary" onClick={handleUpdate} />
            </div>
          )}
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, 
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
  price: prompt.number,
};

ProductCard.defaultProps = {
  image: undefined,
};