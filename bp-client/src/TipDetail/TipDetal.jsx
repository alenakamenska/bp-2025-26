import React, { useState, useEffect } from "react";
import "./TipDetail.css";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios"; 
import { Button } from "../components/Button/Button";
import Loading from "../components/Loading/Loading";

export const TipDetail = () => {
  const { id } = useParams(); 
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchTip = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/Tips/${id}`);
        setTip(response.data);
      } catch (err) {
        console.error("Chyba při načítání detailu rady:", err);
        setError("Nepodařilo se načíst detail rady");
      } finally {
        setLoading(false);
      }
    };
    fetchTip();
    }, [id, API_BASE_URL]); 

    if (loading) return <Loading />; 
    if (error) return <p className="status-message error-text">{error}</p>;
    if (!tip) return <p className="status-message">Rada nebyla nalezena.</p>;

  return (
        <div className="tip-container">
            <div className="tip fade-in">
                <h1>{tip.name}</h1>
                <div className="tip-content">
                    <p className="tip-info">{tip.info}</p>
                </div>
                <div className="buttons-detail">
                    <Button variant="primary" onClick={() => navigate("/rady")} text="← Zpět na seznam"/>
                </div>
            </div>
        </div>
    );
};