import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../Providers/AuthProvider";
import "./ProductUpdate.css";
import { ProductForm } from "../components/ProductForm/ProductForm";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading";

export const ProductUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [state] = useAuthContext();
    const [serverErrors, setServerErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]); 
    const [initialProductData, setInitialProductData] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const categoryOptions = useMemo(() => [
        { value: "", label: "Vyberte kategorii..." },
        ...categories.map(c => ({ value: c.id, label: c.name }))
    ], [categories]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [productRes, categoriesRes, tipsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/Products/${id}`),
                    axios.get(`${API_BASE_URL}/Categories`),
                    axios.get(`${API_BASE_URL}/Products/product/${id}`).catch(() => ({ data: [] }))
                ]);
                setCategories(categoriesRes.data);
                setInitialProductData({
                    nameProduct: productRes.data.name,
                    price: productRes.data.price,
                    infoProduct: productRes.data.info,
                    imageProductURL: productRes.data.imageURL,
                    categoryId: productRes.data.categoryId,
                    businessId: productRes.data.businessId,
                    tips: tipsRes.data.length > 0 
                    ? tipsRes.data.map(t => ({ 
                        nameTip: t.name, 
                        text: t.info, 
                        id: t.id,
                        userId: t.userId 
                      })) 
                    : [{ nameTip: "", text: "" }] 
                });
            } catch (err) {
                //console.error("Chyba při načítání dat:", err);
                toast.error("Nepodařilo se načíst data produktu");
            } finally {
                setLoading(false);
            }
        };
        if (id) loadInitialData();
    }, [id, API_BASE_URL]);

    const onUpdateProduct = async (data) => {
        try {
            let catId = data.categoryId;
            if (data.isNewCategory && data.newCategoryName) {
                const catRes = await axios.post(`${API_BASE_URL}/Categories`, 
                    { Name: data.newCategoryName }, 
                    { headers: { Authorization: `Bearer ${state.accessToken}` } }
                );
                catId = catRes.data.id;
                setCategories(prev => [...prev, catRes.data]);
            }
            const payload = {
                Id: Number(id),
                Name: data.nameProduct,
                Info: data.infoProduct,
                Price: Number(data.price),
                ImageURL: data.imageProductURL,
                CategoryId: Number(catId),
                BusinessId: Number(data.businessId)
            };
            await axios.put(`${API_BASE_URL}/Products/${id}`, payload, {
                headers: { Authorization: `Bearer ${state.accessToken}` }
            });
            if (initialProductData.tips) {
                const deletePromises = initialProductData.tips
                    .filter(t => t.id)
                    .map(t => axios.delete(`${API_BASE_URL}/Tips/${t.id}`, {
                        headers: { Authorization: `Bearer ${state.accessToken}` }
                    }).catch(() => null));
                await Promise.all(deletePromises);
            }
            if (data.tips && data.tips.length > 0) {
                const createPromises = data.tips
                    .filter(t => t.text || t.nameTip)
                    .map(t => {
                        const originalTip = initialProductData.tips.find(it => it.id === t.id);
                        const tipPayload = {
                            Name: t.nameTip,
                            Info: t.text,
                            ProductId: Number(id),
                            CategoryId: Number(catId),
                            UserId: originalTip ? originalTip.userId : null 
                        };
                        return axios.post(`${API_BASE_URL}/Tips/TipsP`, tipPayload, {
                            headers: { Authorization: `Bearer ${state.accessToken}` }
                        });
                    });
                await Promise.all(createPromises);
            }
            toast.success("Produkt byl úspěšně aktualizován");
            navigate(-1);
            return true;
        } catch (error) {
            //console.error("Chyba při aktualizaci:", error);
            let msg = "Při aktualizaci došlo k chybě";
            if (error.response?.data) {
                msg = error.response.data.title || error.response.data.message || JSON.stringify(error.response.data);
            } else {
                msg = error.message;
            }
            setServerErrors([typeof msg === 'object' ? "Chyba dat (400 Bad Request)" : msg]);
            return false;
        }
    };

    if (loading) return <Loading/>;

    return (
        <div className="product-update-container">
            <h2>Upravit produkt</h2>
            {initialProductData && (
                <ProductForm
                    onSubmit={onUpdateProduct}
                    categoryOptions={categoryOptions}
                    serverErrors={serverErrors}
                    initialData={initialProductData}
                />
            )}
        </div>
    );
};