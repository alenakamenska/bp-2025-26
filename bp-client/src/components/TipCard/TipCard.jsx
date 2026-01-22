import React from 'react';
import './TipCard.css'; 
import { Button } from '../Button/Button';
import { useNavigate } from 'react-router-dom';

export const TipCard = ({ tip, userId, onDelete }) => {
    const navigate = useNavigate(); 
    const handleDetailClick = () => {
        navigate(`/rady/${tip.id}`); 
    };
    const handleDelete = () =>{
        onDelete(tip.id);
    }
  return (
    <div className="tip-card">
      <div className="tip-card-content">
        <h3 className="tip-title">{tip.name}</h3>
        <p className="tip-info-card">{tip.info}</p>
      </div>
      
      <div className="tip-card-footer">
        
        <Button text="více" variant="primary" onClick={handleDetailClick}/>
        {tip.userId === userId && ( 
            <Button text="smazat" variant="danger" onClick={handleDelete}/>
        )}
        </div>
    </div>
  );
};