import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { useForm } from "react-hook-form";
import axios from "axios"; 
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { useAuthContext } from "../Providers/AuthProvider";
import { Select } from "../components/Select/Select";
import Error from "../components/Error/Error";
import "./BusinessSettings.css";

export const BusinessSettings = () => {
    const { id } = useParams(); 
    const businessId = id;    
    const navigate = useNavigate();
    const [state] = useAuthContext();
    const [activeTab, setActiveTab] = useState("profile");
    const [categories, setCategories] = useState([]);
    const [openingHours, setOpeningHours] = useState([]);
    const [originalFullObject, setOriginalFullObject] = useState(null); 
    const [serverErrors, setServerErrors] = useState([]);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const daysOrder = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];
    
    const businessForm = useForm();
    const { register: regBusiness, reset: resetBusiness, handleSubmit: handleBusinessSubmit, formState: { errors: errorsBusiness } } = businessForm;
    const productForm = useForm();
    const { register: regProduct, reset: resetProduct, handleSubmit: handleProductSubmit, formState: { errors: errorsProduct } } = productForm;

    const userId = state.profile?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                   || state.profile?.sub;

    const categoryOptions = useMemo(() => [
        { value: "", label: "Vyberte kategorii..." },
        ...categories.map(c => ({ value: c.id, label: c.name }))
    ], [categories]);

    useEffect(() => {
        const loadDetail = async () => {
            try {
                const [businessRes, categoriesRes, hoursRes] = await Promise.all([
                    axios.get(`https://localhost:7014/api/Businesses/${businessId}`),
                    axios.get("https://localhost:7014/api/Categories"),
                    axios.get(`https://localhost:7014/api/OpeningHours/business/${businessId}`)
                ]);
                
                if (!businessRes.data.userIds.includes(userId)) {
                    navigate("/uzivatel");
                    return;
                }
                const b = businessRes.data;
                setOriginalFullObject(b); 
                setCategories(categoriesRes.data);
                resetBusiness({
                    name: b.name || "",
                    city: b.city || "",
                    street: b.street || "",
                    houseNumber: b.houseNumber || "",
                    info: b.info || "",
                    imageURL: b.imageURL || ""
                });

                const sortedHours = hoursRes.data.sort((a, b) => 
                    daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
                );
                setOpeningHours(sortedHours);
            } catch (err) {
                console.error("Chyba při načítání dat:", err);
                navigate("/uzivatel");
            }
        };

        if (businessId) loadDetail();
    }, [businessId, userId, navigate, resetBusiness]);

    const handleHourChange = (index, field, value) => {
        const newHours = [...openingHours];
        newHours[index] = { ...newHours[index], [field]: value };
        setOpeningHours(newHours);
    };

    const onUpdateBusiness = async (formData) => { 
        setServerErrors([]);
        try {
            const updatedBusiness = { ...originalFullObject, ...formData };
            await axios.put(`https://localhost:7014/api/Businesses/${businessId}`, updatedBusiness, { headers: { Authorization: `Bearer ${state.accessToken}` } });
            await axios.put(`https://localhost:7014/api/OpeningHours/bulk`, openingHours, { headers: { Authorization: `Bearer ${state.accessToken}` } });
            alert("Profil podniku byl úspěšně aktualizován.");
            setOriginalFullObject(updatedBusiness);
        } catch (error) {
            setServerErrors(["Nepodařilo se uložit změny podniku."]);
        }
    };

    const onAddProduct = async (productData) => {
        setServerErrors([]);
        try {
            let catId = productData.categoryId;
            if (showNewCategory && newCategoryName) {
                const catRes = await axios.post("https://localhost:7014/api/Categories", { Name: newCategoryName }, { headers: { Authorization: `Bearer ${state.accessToken}` } });
                catId = catRes.data.id;
            }
            const payload = {
                Name: productData.nameProduct,
                Info: productData.infoProduct,
                Price: Number(productData.price),
                ImageURL: productData.imageProductURL,
                CategoryId: Number(catId),
                BusinessId: Number(businessId)
            };
            await axios.post("https://localhost:7014/api/Products", payload, { headers: { Authorization: `Bearer ${state.accessToken}` } });
            alert("Produkt byl úspěšně přidán.");
            resetProduct();
            setShowNewCategory(false);
            setNewCategoryName("");
        } catch (error) {
            if (error.response && error.response.data) {
                setServerErrors([error.response.data]); 
            } else {
                setServerErrors(["Něco se nepovedlo na serveru."]);
            }
        }
    };

    return (
        <div className="business-settings-page">
            <h1 className="settings-page-title">Správa podniku</h1>
            <div className="tabs-navigation">
                <button 
                    className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                >
                    Informace o podniku
                </button>
                <button 
                    className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
                    onClick={() => setActiveTab("products")}
                >
                    Přidat produkt
                </button>
            </div>
            <div className="tab-content">
                {activeTab === "profile" && (
                    <div className="business-header-edit fade-in">
                        <h2>Nastavení profilu podniku</h2>
                        <div className="business-edit-grid">
                            <Input 
                                label="Název podniku" 
                                error={errorsBusiness.name} 
                                {...regBusiness("name", { required: "Název je povinný" })} />
                            <Input 
                                label="Město" 
                                error={errorsBusiness.city} 
                                {...regBusiness("city")} />
                            <Input 
                                label="Ulice" 
                                error={errorsBusiness.street} 
                                {...regBusiness("street")} />
                            <Input 
                                label="Číslo popisné" 
                                error={errorsBusiness.houseNumber} 
                                {...regBusiness("houseNumber")} />
                            <Input 
                                label="URL loga/obrázku" 
                                error={errorsBusiness.imageURL} 
                                {...regBusiness("imageURL")} />
                            <div className="opening-hours-section">
                                <h3 className="oh-title">Otevírací doba</h3>
                                <div className="hours-grid">
                                    {openingHours.map((oh, index) => (
                                        <div key={oh.day} className="day-row">
                                            <strong>{oh.day}</strong>
                                            <Input 
                                                type="time" 
                                                value={oh.start?.substring(0, 5)} 
                                                onChange={(e) => handleHourChange(index, "start", e.target.value)} />
                                            <Input 
                                                type="time" 
                                                value={oh.end?.substring(0, 5)} 
                                                onChange={(e) => handleHourChange(index, "end", e.target.value)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="textarea-full">
                                <label>Popis podniku</label>
                                <textarea className="custom-textarea" {...regBusiness("info")} rows="3" />
                            </div>
                        </div>
                        <Button 
                            type="button" 
                            text="Uložit změny profilu" 
                            onClick={handleBusinessSubmit(onUpdateBusiness)} 
                            className="primary"/>
                    </div>
                )}
                {activeTab === "products" && (
                    <div className="business-flex-form-container fade-in">
                        <h2>Přidat nový produkt do nabídky</h2>
                        <form onSubmit={handleProductSubmit(onAddProduct)} className="business-flex-form">
                            <div className="form-column">
                                <Input 
                                    label="Název produktu" 
                                    {...regProduct("nameProduct", { required: "Název produktu je povinný" })} 
                                    error={errorsProduct.nameProduct} />
                                <Input 
                                    label="Cena (Kč)" 
                                    type="number" 
                                    step="0.01" 
                                    {...regProduct("price", { required: "Cena je povinná" })} 
                                    error={errorsProduct.price} />
                                <Input 
                                    label="URL obrázku produktu" 
                                    {...regProduct("imageProductURL")} />
                                <label>Popis produktu</label>
                                <textarea 
                                    className="custom-textarea" 
                                    {...regProduct("infoProduct")} 
                                    rows="4" />
                            </div>
                            <div className="form-column">
                                <h3>Zařazení</h3>
                                <div className="category-section">
                                    {!showNewCategory ? (
                                        <div className="flex-row">
                                            <Select 
                                                label="Kategorie" 
                                                options={categoryOptions} 
                                                {...regProduct("categoryId", { required: !showNewCategory })} 
                                                error={errorsProduct.categoryId} />
                                            <Button 
                                                type="button" 
                                                text="Nová kategorie" 
                                                onClick={() => setShowNewCategory(true)} />
                                        </div>
                                    ) : (
                                        <div className="flex-row">
                                            <Input 
                                                label="Nová kategorie" 
                                                value={newCategoryName} 
                                                onChange={(e) => setNewCategoryName(e.target.value)} />
                                            <Button 
                                                type="button" 
                                                text="Zpět" onClick={() => setShowNewCategory(false)} />
                                        </div>
                                    )}
                                </div>
                                <Error serverErrors={serverErrors}/>
                                <Button type="submit" className="primary" text="Uložit produkt" />
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};