import React, { useState, useEffect } from "react";
import "./MyBussinesses.css"; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { useAuthContext } from "../Providers/AuthProvider";
import Card from "../components/Card/card";
import { BusinessForm } from "../components/BusinessForm/BusinessForm"; 
import EmptyState from "../components/EmptyState/EmptyState";
import Loading from "../components/Loading/Loading";
import { toast } from "react-toastify";
import { ConfirmModal } from "../components/ConfirmModal/ConfirmModal";

export const MyBusiness = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [state] = useAuthContext(); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [businessIdToDelete, setBusinessIdToDelete] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    const userId = state.profile?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                    || state.profile?.sub;

    useEffect(() => {
        const loadInitialData = async () => {
            if (!userId) return; 
            setLoading(true);
            try {
                const bizRes = await axios.get(`${API_BASE_URL}/Businesses/user/${userId}`, {
                    headers: { Authorization: `Bearer ${state.accessToken}` }
                });
                setBusinesses(bizRes.data);
            } catch (err) {
                //console.error("Chyba při načítání podniků:", err);
                toast.error("Chyba při načítání")
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [userId, state.accessToken, API_BASE_URL]);

    const handleBusinessSubmit = async (data) => {      
        const businessPayload = {
            name: data.name,
            city: data.city,
            street: data.street,
            houseNumber: data.houseNumber,
            imageURL: data.imageURL, 
            info: data.info,
            ico: data.ICO,
            isVerified: data.isVerified,
            userId: userId,
            openingHours: []
        };
        try {
            const bizRes = await axios.post(
                `${API_BASE_URL}/Businesses`, 
                businessPayload, 
                { headers: { Authorization: `Bearer ${state.accessToken}` } }
            );
            const newBusinessId = bizRes.data.id;
            const hoursPromises = data.openingHours.map(hour => {
                return axios.post(`${API_BASE_URL}/OpeningHours`, {
                    day: hour.day,
                    start: hour.isClosed ? "00:00" : hour.start,
                    end: hour.isClosed ? "00:00" : hour.end,
                    isClosed: hour.isClosed,
                    businessId: newBusinessId 
                }, {
                    headers: { Authorization: `Bearer ${state.accessToken}` }
                });
            });
            await Promise.all(hoursPromises);
            toast.success("Podnik byl úspěšně vytvořen");
            navigate("/podniky");
        } catch (error) {
            //console.error("Chyba při ukládání:", error.response?.data || error.message);
            toast.error("Ukládání se nezdařilo.");
        }
    };

    const openDeleteModal = (id) => {
        setBusinessIdToDelete(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!businessIdToDelete) return;
        try {
            await axios.delete(`${API_BASE_URL}/Businesses/${businessIdToDelete}`, {
                headers: { Authorization: `Bearer ${state.accessToken}` }
            });
            setBusinesses(prev => prev.filter(p => p.id !== businessIdToDelete));
            toast.success("Podnik byl úspěšně smazán");
        } catch (err) {
            toast.error("Smazání se nepodařilo");
        } finally {
            setIsModalOpen(false);
            setBusinessIdToDelete(null);
        }
    };

    return (
        <div className="Mybusiness-page">
            <section className="my-businesses-section">
                <h2>Moje podniky</h2>
                {loading ? (
                    <Loading/>
                ) : (
                    <>
                        {businesses.length > 0 ? (
                            <div className="Mybusinesses-grid">
                                {businesses.map((b) => (
                                    <Card 
                                        key={b.id}
                                        image={b.imageURL}      
                                        name={b.name}
                                        street={b.street}
                                        houseNumber={b.houseNumber}
                                        city={b.city}
                                        id={b.id}
                                        owner={true} 
                                        isVerified={b.isVerified}
                                        onDelete={() => openDeleteModal(b.id)}          
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="Zatím nespravujete žádné podniky"
                                message="Níže můžete přidat nový podnik"
                            />
                        )}
                    </>
                )}
            </section>
            <section className="add-business-section">
                <h2>Přidat nový podnik</h2> 
                <BusinessForm 
                    onSubmit={handleBusinessSubmit} 
                    accessToken={state.accessToken} 
                />
            </section>
            <ConfirmModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Smazat podnik?"
                message="Opravdu chcete tento podnik smazat?"
            />
        </div>
    );
};