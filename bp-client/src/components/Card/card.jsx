import PropTypes from "prop-types";
import "../Card/card.css";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";

export default function Card({ id, image, name, street, houseNumber, city, owner, isVerified, onDelete }) {
  const navigate = useNavigate(); 
  const imageSrc = image && image.trim() !== "" 
    ? image 
    : "https://res.cloudinary.com/dmzyuywuy/image/upload/v1774030317/wo3twta0gmtgf7y9bsq6.jpg";

  const fullAddress = street && houseNumber 
    ? `${street} ${houseNumber}, ${city}` 
    : "Adresa není uvedena";

  const handleDetailClick = () => {
    navigate(`/podnik/${id}`); 
  };

  const handleDelete = () =>{
        onDelete(id);
  }
  return (
    <div className="card">
      {imageSrc && (
        <img src={imageSrc} alt={name} className="card-image" />
      )}
      <div className="card-body">
        <h3 className="card-title">
          {name}
          <span className={`status-badge ${isVerified ? "verified" : "unverified"}`} 
            title={isVerified ? "Ověřený podnik" : "Neověřený podnik"}>
            <span className="status-icon">{isVerified ? "✓" : "!"}</span>
          </span>
        </h3>
        <p className="card-address">{fullAddress}</p>
        <div className="card-actions">
          <Button text="více" variant="wheat" onClick={handleDetailClick} />
          {owner && (
            <>
            <Button 
              text="spravovat" 
              variant="wheat" 
              onClick={() => navigate(`/sprava-podniku/${id}`)} 
            />
            <Button
              text="Smazat"
              variant="danger"
              onClick={handleDelete}
              />
            </>
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