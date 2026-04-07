import React from "react";
import PropTypes from "prop-types";
import "../ProductCard/ProductCard.css";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";
// 1. Importujeme potřebné komponenty pro sdílení
import { FacebookShareButton, FacebookIcon } from "react-share";

export default function ProductCard({ id, image, name, price, info, isOwner, onDelete, onUpdate }) {
  const navigate = useNavigate();
  
  // 2. Definujeme absolutní URL pro sdílení
  const shareUrl = `${window.location.origin}/produkt/${id}`;

  const handleDetailClick = () => {
    navigate(`/produkt/${id}`);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const handleUpdate = () => {
    onUpdate(id);
  };

  return (
    <div className="product-card">
      <div className="product-card-image-container">
        <img
          src={image || "https://res.cloudinary.com/dmzyuywuy/image/upload/v1774028116/i4fo794o2e10b2rawqap.png"}
          alt={name}
          className="product-card-image"
        />
      </div>
      <div className="product-card-body">
        <h3 className="product-card-title">{name}</h3>
        <p className="product-info">{info}</p>
        <div className="product-card-footer">
          <Button text="více" variant="primary" onClick={handleDetailClick} />
          <p className="product-card-price">{price} Kč</p>
        </div>
        {isOwner && (
          <div className="product-card-footer owner-actions">
            <Button text="smazat" variant="danger" onClick={handleDelete} />
            <Button text="upravit" variant="secondary" onClick={handleUpdate} />
            <div className="product-card-share-badge">
              <FacebookShareButton url={shareUrl} quote={`Koukni na ${name}!`}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            </div>
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
  price: PropTypes.number, 
  info: PropTypes.string,
  isOwner: PropTypes.bool,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
};

ProductCard.defaultProps = {
  image: undefined,
  isOwner: false,
};