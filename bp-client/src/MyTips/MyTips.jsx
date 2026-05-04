import React, { useState, useEffect } from "react";
import "./MyTips.css";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { TipCard } from "../components/TipCard/TipCard";
import { useAuthContext } from "../Providers/AuthProvider";
import EmptyState from "../components/EmptyState/EmptyState";
import Loading from "../components/Loading/Loading";
import { toast } from 'react-toastify';
import { ConfirmModal } from "../components/ConfirmModal/ConfirmModal"; 

export const MyTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state] = useAuthContext();  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipIdToDelete, setTipIdToDelete] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const userId = state.profile?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                 || state.profile?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"]
                 || state.profile?.sub;

  const navigate = useNavigate(); 

  const openDeleteModal = (id) => {
    setTipIdToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tipIdToDelete) return;
    try {
        await axios.delete(`${API_BASE_URL}/Tips/${tipIdToDelete}`, {
            headers: { Authorization: `Bearer ${state.accessToken}` }
        });
        setTips(prevTips => prevTips.filter(t => t.id !== tipIdToDelete));
        toast.success("Rada byla smazána");
    } catch (err) {
        toast.error("Chyba při mazání rady");
    } finally {
        setIsModalOpen(false);
        setTipIdToDelete(null);
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
        setError("Nepodařilo se načíst vaše rady");
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [userId, API_BASE_URL]); 

  if (loading) return <Loading/>;

  return (
    <div className="tips-page-wrapper">
      <main className="product-list-container">
        <div className="tips-grid">
           <div className="add-tip-card" onClick={() => navigate("/pridat-radu")}>
              <div className="add-icon">+</div>
              <span className="add-text">Přidat novou radu</span>
            </div>
          {tips.map((item) => (
            <TipCard 
              key={item.id} 
              tip={item} 
              isOwner={true}
              onDelete={() => openDeleteModal(item.id)} 
              onUpdate={() => navigate(`/upravit-radu/${item.id}`)}
            />
          ))}
        </div>
        {tips.length === 0 && !loading && (
          <EmptyState
            title="Zatím jste nepřidali žádné rady"
            message="Zkuste přidat svoji první radu"
          />
        )}
      </main>
      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Smazat radu?"
        message="Opravdu chcete tuto radu trvale odstranit?"
      />
    </div>
  );
};