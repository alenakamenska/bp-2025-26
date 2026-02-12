import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { useForm } from "react-hook-form";
import axios from "axios"; 
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { useAuthContext } from "../Providers/AuthProvider";
import { Select } from "../components/Select/Select";
import Error from "../components/Error/Error";

export const BusinessSettings = () => {
    const { id } = useParams(); 
    const businessId = id;    
    const navigate = useNavigate();
    const [state] = useAuthContext();
    const [categories, setCategories] = useState([]);
    const [businessName, setBusinessName] = useState("");
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [serverErrors, setServerErrors] = useState([]);

    const { register, handleSubmit, formState: { errors } } = useForm();

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
                    return;
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
    }, [businessId, userId, navigate]);

    const onSubmit = async (data) => {
        let finalCategoryId = data.categoryId;
        setServerErrors([]);

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
            const errorData = error.response?.data;
            if (errorData) {
                if (Array.isArray(errorData)) {
                    setServerErrors(errorData);
                } else if (typeof errorData === 'object') {
                    const flatErrors = Object.values(errorData).flat();
                    setServerErrors(flatErrors);
                } else {
                    setServerErrors([error.message]);
                }
            }
        }
    };

    return (
        <div className="business-page">
            <h2>Přidat produkt do: {businessName}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="business-flex-form">
                <div className="form-column">
                    <Input 
                        label="Název produktu" 
                        {...register("name", { required: "Název produktu je povinný" })} 
                        error={errors.name} 
                    />
                    <Input 
                        label="Cena (Kč)" 
                        type="number" 
                        step="0.01" 
                        {...register("price", { 
                            required: "Cena je povinná",
                            min: { value: 0, message: "Cena nesmí být záporná" }
                        })} 
                        error={errors.price}
                    />
                    <Input 
                        label="URL obrázku" 
                        {...register("imageURL")} 
                        error={errors.imageURL}
                    />
                    <label>Popis produktu</label>
                    <textarea 
                        className={`custom-textarea ${errors.info ? "input-error" : ""}`} 
                        {...register("info")} 
                        rows="4" 
                    />
                </div>
                <div className="form-column">
                    <h3>Zařazení</h3>
                    <div className="category-section">
                        {!showNewCategory ? (
                            <div className="flex-row">
                                <Select 
                                    label="Kategorie"
                                    options={categoryOptions}
                                    {...register("categoryId", { 
                                        required: !showNewCategory ? "Musíte vybrat kategorii" : false 
                                    })}
                                    error={errors.categoryId}
                                />
                                <Button 
                                    type="button"
                                    className="primary" 
                                    text="přidat kategorii" 
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
                                    type="button"
                                    className="primary" 
                                    text="Zpět" 
                                    onClick={() => setShowNewCategory(false)} 
                                    style={{ marginTop: '25px' }}
                                />
                            </div>
                        )}
                    </div>
                    <Error serverErrors={serverErrors}/>
                    <Button
                        type="submit"
                        className="primary"
                        text="uložit produkt"/>
                </div>
            </form>
        </div>
    );
};