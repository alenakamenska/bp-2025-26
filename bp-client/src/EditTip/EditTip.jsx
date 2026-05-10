import React, { useState, useEffect, useMemo } from "react"; 
import "./EditTip.css"; 
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios"; 
import { useAuthContext } from "../Providers/AuthProvider";
import { TipForm } from "../components/TipForm/TipForm";
import { useAuthorization } from "../useAuthorization";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading";

export const EditTip = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [state] = useAuthContext();
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [categories, setCategories] = useState([]);
    const [initialTipData, setInitialTipData] = useState(null); 
    const { checkAccess } = useAuthorization();
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const userId = state.profile?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                   || state.profile?.sub;

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [catRes, tipRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/Categories`),
                    axios.get(`${API_BASE_URL}/Tips/${id}`),
                ]);
                const isOk = checkAccess(tipRes.data, userId, "tip");
                if (!isOk) return;
                setCategories(catRes.data);
                setInitialTipData({
                    name: tipRes.data.name,
                    info: tipRes.data.info,
                    categoryId: tipRes.data.categoryId || "",
                    userId: tipRes.data.userId ,
                    productId: tipRes.data.productId
                });
            } catch (err) {
                //console.error("Chyba při načítání:", err);
                toast.error("Chyba při načítání")
            }
        };
        loadInitialData();
    }, [id]); 

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
                id: Number(id), 
                name: formData.name,
                info: formData.info,
                userId: initialTipData.userId, 
                categoryId: finalCategoryId,
                productId: initialTipData.productId
            };

            await axios.put(`${API_BASE_URL}/Tips/${id}`, payload, {
                headers: { Authorization: `Bearer ${state.accessToken}` }
            });
            toast.success("rada byla úspěšně aktualizována")
            navigate(-1);
        } catch (error) {
            //console.error("Chyba:", error.response?.data || error.message);
            toast.error(error.response?.data || error.message)
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!initialTipData) return <Loading/>;

    return (
        <div className="login-container"> 
            <TipForm 
                onSubmit={onSubmit} 
                isSubmitting={isSubmitting}
                categoryOptions={categoryOptions}
                title="Upravit radu" 
                initialData={initialTipData}
            />
        </div>
    );
};