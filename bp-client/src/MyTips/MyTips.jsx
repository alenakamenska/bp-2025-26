import React, { useState, useEffect } from "react";
import "./MyTips.css";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { TipCard } from "../components/TipCard/TipCard";
import { useAuthContext } from "../Providers/AuthProvider";

export const MyTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state] = useAuthContext();  

  const userId = state.profile?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                 || state.profile?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"]
                 || state.profile?.sub
                 || state.profile?.name;

  const isLoggedIn = !!state.accessToken;    
  const navigate = useNavigate(); 
  const handleDeleteTip = async (id) => {
    if (!window.confirm("Opravdu chcete tuto radu smazat?")) return;
    try {
        await axios.delete(`https://localhost:7014/api/Tips/${id}`, {
            headers: { Authorization: `Bearer ${state.accessToken}` }
        });
        setTips(prevTips => prevTips.filter(t => t.id !== id));
    } catch (err) {
        console.error("Nepodařilo se smazat tip:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://localhost:7014/api/Tips/user/${userId}`);
        setTips(response.data);
      } catch (err) {
        console.error("Chyba při fetchování dat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []); 

  if (loading) return <div className="status-message"><p>Načítám rady a tipy...</p></div>;
  if (error) return <div className="status-message error"><p>{error}</p></div>;

  return (
    <div className="tips-page-wrapper">
      <main className="product-list-container">
        <div className="tips-grid">
          {tips.map((item) => (
            <TipCard 
              key={item.id} 
              tip={item} 
              userId={userId} 
              onDelete={handleDeleteTip} 
              onUpdate={() => navigate(`/upravit-radu/${item.id}`)}
            />
          ))}
        </div>
        {tips.length === 0 && (
          <div className="no-data-container">
            <p className="no-data-info">Zatím nebyly přidány žádné rady. Buďte první!</p>
          </div>
        )}
      </main>
    </div>
  );
};