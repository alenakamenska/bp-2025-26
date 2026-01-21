import React, { useState, useEffect } from "react";
import "./TipDetail.css";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios"; 
import { useAuthContext } from "../Providers/AuthProvider";
import { Button } from "../components/Button/Button";

export const TipDetail = () => {
  const { id } = useParams(); 
 const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state] = useAuthContext();  
  
  const isLoggedIn = !!state.accessToken;    
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchTip = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://localhost:7014/api/Tips/${id}`);
        setTip(response.data);
      } catch (err) {
        setError("Nepodařilo se načíst detail rady");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTip();
  }, [id]); 

  if (loading) return <p className="status-message">Načítám detail...</p>;
  if (error) return <p className="status-message" style={{ color: 'red' }}>{error}</p>;
  if (!tip) return <p className="status-message">Rada nebyla nalezena.</p>;

  return (
        <div className="tip-container">
            <div className="arrow">
                <Button variant="white" text="<-" onClick={() => navigate(`/rady/${Number(id) + 1}`)} />
            </div>
            <div className="tip">
                <h1>{tip.name}</h1>
                <p className="tip-info">{tip.info}</p>
                <div className="buttons">
                    <Button variant="primary" onClick={() => navigate("/rady")} text="Zpět"/>
                    {isLoggedIn && (
                        <Button variant="primary" onClick={() => navigate(`/edit-radu/${id}`)} text="Upravit radu"/>
                    )}
                </div>
            </div>
            <div className="arrow">
                <Button variant="white" onClick={() => navigate(`/rady/${Number(id) + 1}`)} text="->" />
            </div>
        </div>
    );
};