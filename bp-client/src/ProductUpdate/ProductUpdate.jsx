import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../Providers/AuthProvider";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { Select } from "../components/Select/Select"; 
import "./ProductUpdate.css";

export const ProductUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [state] = useAuthContext();
    const [serverErrors, setServerErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]); 

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const categoryOptions = useMemo(() => [
        { value: "", label: "Vyberte kategorii..." },
        ...categories.map(c => ({ value: c.id, label: c.name }))
    ], [categories]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [productRes, categoriesRes] = await Promise.all([
                    axios.get(`https://localhost:7014/api/Products/${id}`),
                    axios.get("https://localhost:7014/api/Categories")
                ]);

                setCategories(categoriesRes.data);
                
                reset({
                    nameProduct: productRes.data.name,
                    price: productRes.data.price,
                    infoProduct: productRes.data.info,
                    imageProductURL: productRes.data.imageURL,
                    categoryId: productRes.data.categoryId,
                    businessId: productRes.data.businessId 
                });
                
                setLoading(false);
            } catch (err) {
                console.error("Chyba při načítání dat:", err);
            }
        };

        if (id) loadInitialData();
    }, [id, reset, navigate]);

    const onUpdateProduct = async (formData) => {
        try {
            const payload = {
                Name: formData.nameProduct,
                Info: formData.infoProduct,
                Price: Number(formData.price),
                ImageURL: formData.imageProductURL,
                CategoryId: Number(formData.categoryId),
                BusinessId: Number(formData.businessId) 
            };

            await axios.put(`https://localhost:7014/api/Products/${id}`, payload, {
                headers: { Authorization: `Bearer ${state.accessToken}` }
            });
            alert("Produkt byl úspěšně upraven");
        } catch (error) {
            setServerErrors(["Nepodařilo se uložit změny"]);
        }
    };

    if (loading) return <p>Načítám produkt a kategorie...</p>;

    return (
        <div className="product-update-container">
            <h2>Upravit produkt</h2>
            <form onSubmit={handleSubmit(onUpdateProduct)}>
                <Input 
                    label="Název produktu" 
                    {...register("nameProduct", { required: "Povinné" })} 
                    error={errors.nameProduct} 
                />
                <Input 
                    label="Cena" 
                    type="number"
                    {...register("price", { required: "Povinné" })} 
                    error={errors.price} 
                />
                <Select 
                    label="Kategorie" 
                    options={categoryOptions} 
                    {...register("categoryId", { required: "Kategorie je povinná" })} 
                    error={errors.categoryId} 
                />
                <Input 
                    label="URL obrázku" 
                    {...register("imageProductURL")} 
                />
                <textarea 
                    className="custom-textarea"
                    {...register("infoProduct")} 
                    placeholder="Popis produktu..."
                    rows="4"
                />
                <div className="button-group">
                    <Button type="submit" className="primary" text="Uložit změny" />
                    <Button type="button" text="Zrušit" onClick={() => navigate(-1)} />
                </div>
                {serverErrors.length > 0 && <p className="error">{serverErrors[0]}</p>}
            </form>
        </div>
    );
};