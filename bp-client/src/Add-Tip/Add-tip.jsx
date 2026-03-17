import React, { useState, useEffect, useMemo } from "react"; 
import "./Add-tip.css"; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { useAuthContext } from "../Providers/AuthProvider";
import { TipForm } from "../components/TipForm/TipForm";

export const AddTip = () => {
    const navigate = useNavigate();
    const [state] = useAuthContext();
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const userId = state.profile?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                || state.profile?.sub;

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    axios.get("https://localhost:7014/api/Categories"),
                    axios.get("https://localhost:7014/api/Products")
                ]);
                setCategories(catRes.data);
                setProducts(prodRes.data.items);
            } catch (err) {
                console.error("Chyba při načítání:", err);
            }
        };
        loadInitialData();
    }, []);

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
                    "https://localhost:7014/api/Categories", 
                    { Name: formData.newCategoryName }, 
                    { headers: { Authorization: `Bearer ${state.accessToken}` } }
                );
                finalCategoryId = catRes.data.id;
            }
            const payload = {
                name: formData.name,
                info: formData.info,
                userId: userId,
                categoryId: finalCategoryId,
            };
            await axios.post("https://localhost:7014/api/Tips", payload, {
                headers: { Authorization: `Bearer ${state.accessToken}` }
            });
            navigate("/rady");
        } catch (error) {
            console.error("Chyba:", error.response?.data || error.message);
            alert("Nepodařilo se uložit radu");
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