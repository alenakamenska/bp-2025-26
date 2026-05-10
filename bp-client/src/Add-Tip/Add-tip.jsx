import React, { useState, useEffect, useMemo } from "react"; 
import "./Add-tip.css"; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { useAuthContext } from "../Providers/AuthProvider";
import { TipForm } from "../components/TipForm/TipForm";
import { toast } from "react-toastify";

export const AddTip = () => {
    const navigate = useNavigate();
    const [state] = useAuthContext();
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [categories, setCategories] = useState([]);
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const userId = state.profile?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                || state.profile?.sub;

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [catRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/Categories`),
                ]);
                setCategories(catRes.data);
            } catch (err) {
                //console.error("Chyba při načítání:", err);
            }
        };
        loadInitialData();
    }, [API_BASE_URL]); 

    const categoryOptions = useMemo(() => [
        { value: "", label: "Vyberte kategorii (nepovinné)..." },
        ...categories.map(c => ({ value: c.id, label: c.name }))
    ], [categories]);

    const onSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            let finalCategoryId = formData.categoryId ? Number(formData.categoryId) : null;
            if (formData.newCategoryName) {
                const catRes = await axios.post(
                    `${API_BASE_URL}/Categories`, 
                    { Name: formData.newCategoryName }, 
                    { headers: { Authorization: `Bearer ${state.accessToken}` } }
                );
                finalCategoryId = catRes.data.id;
            }
            const payload = {
                name: formData.name,
                info: formData.info,
                userId: userId,
                categoryId: finalCategoryId 
            };
            await axios.post(`${API_BASE_URL}/Tips`, payload, {
                headers: { Authorization: `Bearer ${state.accessToken}` }
            });
            toast.success("Rada byla úspěšně uložena");
            navigate("/rady");
        } catch (error) {
            //console.error("Chyba:", error.response?.data || error.message);
            toast.error(error.response?.data || error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container"> 
            <TipForm 
                onSubmit={onSubmit} 
                isSubmitting={isSubmitting}
                categoryOptions={categoryOptions}
                title="Přidat radu"
            />
        </div>
    );
};