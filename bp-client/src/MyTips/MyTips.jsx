import React, { useState, useEffect } from "react";
import "./MyTips.css";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { TipCard } from "../components/TipCard/TipCard";
import { useAuthContext } from "../Providers/AuthProvider";
import EmptyState from "../components/EmptyState/EmptyState";
import Loading from "../components/Loading/Loading";

export const MyTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state] = useAuthContext();  
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const userId = state.profile?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                 || state.profile?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"]
                 || state.profile?.sub
                 || state.profile?.name;

  const navigate = useNavigate(); 

  const handleDeleteTip = async (id) => {
    if (!window.confirm("Opravdu chcete tuto radu smazat?")) return;
    try {
        await axios.delete(`${API_BASE_URL}/Tips/${id}`, {
            headers: { Authorization: `Bearer ${state.accessToken}` }
        });
        setTips(prevTips => prevTips.filter(t => t.id !== id));
    } catch (err) {
        console.error("Nepodařilo se smazat tip:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const fetchTips = async () => {
      if (!userId) return; 
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/Tips/user/${userId}`);
        setTips(response.data);
      } catch (err) {
        console.error("Chyba při fetchování dat:", err);
        setError("Nepodařilo se načíst vaše rady.");
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [userId, API_BASE_URL]); 

  if (loading) return <Loading/>;
  if (error) return <div className="status-message error"><p>{error}</p></div>;

  return (
    <div className="tips-page-wrapper">
      <main className="product-list-container">
        <div className="tips-grid">
          {tips.map((item) => (
            <TipCard 
              key={item.id} 
              tip={item} 
              isOwner={true}
              onDelete={handleDeleteTip} 
              onUpdate={() => navigate(`/upravit-radu/${item.id}`)}
            />
          ))}
        </div>
        {tips.length === 0 && (
          <EmptyState
            title="Zatím jste nepřidali žádné rady"
            message="Zkuste přidat svoji první radu"
          />
        )}
      </main>
    </div>
  );
};