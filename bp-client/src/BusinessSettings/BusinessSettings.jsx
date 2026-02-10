import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { useForm } from "react-hook-form";
import axios from "axios"; 
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { useAuthContext } from "../Providers/AuthProvider";
import { Select } from "../components/Select/Select";

export const BusinessSettings = () => {
    const { id } = useParams(); 
    const businessId = id;    
    const navigate = useNavigate();
    const [state] = useAuthContext();
    const [categories, setCategories] = useState([]);
    const [businessName, setBusinessName] = useState("");
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const categoryOptions = [
        { value: "", label: "Vyberte kategorii..." },
        ...categories.map(c => ({ value: c.id, label: c.name }))
    ];
    const userId = state.profile?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                   || state.profile?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"]
                   || state.profile?.sub
                   || state.profile?.nameid;

    useEffect(() => {
        const loadDetail = async () => {
            try {
            const [businessRes, categoriesRes] = await Promise.all([
                axios.get(`https://localhost:7014/api/Businesses/${businessId}`),
                axios.get("https://localhost:7014/api/Categories")
            ]);
            if (!businessRes.data.userIds.includes(userId)) {
                navigate("/uzivatel");
            }
            setBusinessName(businessRes.data.name);
            setCategories(categoriesRes.data);
            } catch (err) {
                console.error("Chyba při načítání dat:", err);
                navigate("/uzivatel");
            }
        };
        if (businessId) {
            loadDetail();
        }
    }, [businessId]);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        let finalCategoryId = data.categoryId;
        try {
            if (showNewCategory && newCategoryName) {
                const catResponse = await axios.post(
                    "https://localhost:7014/api/Categories", 
                    { Name: newCategoryName }, 
                    { headers: { Authorization: `Bearer ${state.accessToken}` } }
                );
                finalCategoryId = catResponse.data.id; 
            }
            const productPayload = {
                Name: data.name,           
                Info: data.info,
                Price: Number(data.price), 
                ImageURL: data.imageURL,
                CategoryId: Number(finalCategoryId),
                BusinessId: Number(businessId)
            };
            if (isNaN(productPayload.BusinessId) || isNaN(productPayload.CategoryId)) {
                alert("Chyba: Neplatné ID firmy nebo kategorie");
                return;
            }
            await axios.post(
                "https://localhost:7014/api/Products", 
                productPayload, 
                { 
                    headers: { 
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${state.accessToken}` 
                    } 
                }
            );
            navigate(`/podnik/${businessId}`);
        } catch (error) {
            console.error("Chyba při ukládání:", error.response?.data || error.message);
            alert("Nepodařilo se uložit produkt. Zkontrolujte konzoli.");
        }
    };

    return (
        <div className="business-page">
            <h2>Přidat produkt do: {businessName}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="business-flex-form">
                <div className="form-column">
                    <Input label="Název produktu" {...register("name", { required: "Povinné" })} />
                    <Input label="Cena (Kč)" type="number" step="0.01" {...register("price", { required: "Povinné" })} />
                    <Input label="URL obrázku" {...register("imageURL")} />
                    <label>Popis produktu</label>
                    <textarea className="custom-textarea" {...register("info")} rows="4" />
                </div>
                <div className="form-column">
                    <h3>Zařazení</h3>
                    <div className="category-section">
                        {!showNewCategory ? (
                            <div className="flex-row">
                                <Select 
                                    label="Kategorie"
                                    options={categoryOptions}
                                    error={errors.categoryId}
                                    {...register("categoryId", { required: "Musíte vybrat kategorii" })}
                                />
                                <Button 
                                    type="primary" 
                                    text="přidat kategorií" 
                                    onClick={() => setShowNewCategory(true)} 
                                    style={{ marginTop: '25px' }} 
                                />
                            </div>
                        ) : (
                            <div className="flex-row">
                                <Input 
                                    label="Nová kategorie"
                                    placeholder="Zadejte název..." 
                                    value={newCategoryName} 
                                    onChange={(e) => setNewCategoryName(e.target.value)} 
                                />
                                <Button 
                                    type="primary" 
                                    text="Zpět" 
                                    onClick={() => setShowNewCategory(false)} 
                                    style={{ marginTop: '25px' }}
                                />
                            </div>
                        )}
                    </div>
                    <Button
                        type="primary"
                        text = "uložit produkt"
                        onClick={() => onSubmit} 
                    />
                </div>
            </form>
        </div>
    );
};