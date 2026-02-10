import React, { useState, useEffect } from "react";
import "./MyBussinesses.css"; 
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { useAuthContext } from "../Providers/AuthProvider";
import Card from "../components/Card/card";

export const MyBusiness = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [state] = useAuthContext(); 
    const userId = state.profile?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                   || state.profile?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"]
                   || state.profile?.sub
                   || state.profile?.nameid;

    useEffect(() => {
        const loadInitialData = async () => {
            if (!userId) return; 
            setLoading(true);
            try {
                const [bizRes] = await Promise.all([
                    axios.get(`https://localhost:7014/api/Businesses/user/${userId}`, {
                        headers: { Authorization: `Bearer ${state.accessToken}` }
                    })
                ]);
                setBusinesses(bizRes.data);
            } catch (err) {
                console.error("Chyba při načítání podniků uživatele:", err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [userId, state.accessToken]);
    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            openingHours: [
                { day: "Pondělí", start: "08:00", end: "16:00" },
                { day: "Úterý", start: "08:00", end: "16:00" },
                { day: "Středa", start: "08:00", end: "16:00" },
                { day: "Čtvrtek", start: "08:00", end: "16:00" },
                { day: "Pátek", start: "08:00", end: "16:00" },
                { day: "Sobota", start: "08:00", end: "16:00" },
                { day: "Neděle", start: "08:00", end: "16:00" }
            ]
        }
    });

    const { fields } = useFieldArray({
        control,
        name: "openingHours"
    });
    const onSubmit = async (data) => {    
        const businessPayload = {
            name: data.name,
            city: data.city,
            street: data.street,
            houseNumber: data.houseNumber,
            imageURL: data.imageURL,
            info: data.info
        };
        try {
            const bizRes = await axios.post(
                "https://localhost:7014/api/Businesses", 
                businessPayload, 
                { headers: { Authorization: `Bearer ${state.accessToken}` } }
            );
            const newBusinessId = bizRes.data.id;
            const hoursPromises = data.openingHours.map(hour => {
                return axios.post("https://localhost:7014/api/OpeningHours", {
                    day: hour.day,
                    start: hour.start,
                    end: hour.end,
                    businessId: newBusinessId 
                }, {
                    headers: { Authorization: `Bearer ${state.accessToken}` }
                });
            });

            await Promise.all(hoursPromises);
            navigate("/podniky");
        } catch (error) {
            console.error("Chyba při ukládání:", error.response?.data || error.message);
            alert("Ukládání se nezdařilo. Zkontrolujte připojení k API");
        }
    };

    return (
        <div className="business-page">
            <h2>Moje podniky</h2>
            {loading ? (
                <div className="loading-spinner">Načítám vaše podniky...</div>
            ) : (
                <div className="businesses-grid">
                    {businesses.length > 0 ? (
                        businesses.map((b) => (
                            <Card 
                                key={b.id}
                                image={b.imageURL}      
                                name={b.name}
                                street={b.street}
                                houseNumber={b.houseNumber}
                                city={b.city}
                                id={b.id}
                                owner={true}            
                            />
                        ))
                    ) : (
                        <p className="no-data-text">Zatím nespravujete žádné podniky.</p>
                    )}
                </div>
            )}
            <h2>Přidat nový podnik</h2> 
            <form onSubmit={handleSubmit(onSubmit)} className="business-flex-form">
                <div className="form-column">
                    <Input 
                        label="Název firmy" 
                        error={errors.name} 
                        {...register("name", { required: "Název je povinný" })} 
                    />
                    <Input label="Město" {...register("city")} />
                    <Input label="Ulice" {...register("street")} />
                    <Input label="Číslo popisné" {...register("houseNumber")} />
                    <Input label="URL obrázku" {...register("imageURL")} />
                    <label className="form-label">Popis firmy</label>
                    <textarea 
                        className="custom-textarea" 
                        {...register("info")} 
                        rows="4" 
                        placeholder="Krátce představte své zahradnictví..."
                    />
                </div>
                <div className="form-column">
                    <h3>Otevírací hodiny</h3>
                    <div className="hours-container">
                        {fields.map((field, index) => (
                            <div key={field.id} className="opening-hours-row">
                                <span className="day-label">{field.day}</span>
                                <input type="hidden" {...register(`openingHours.${index}.day`)} />
                                
                                <input 
                                    type="time" 
                                    {...register(`openingHours.${index}.start`)} 
                                    className="time-input"
                                />
                                <span className="time-separator">do</span>
                                <input 
                                    type="time" 
                                    {...register(`openingHours.${index}.end`)} 
                                    className="time-input"
                                />
                            </div>
                        ))}
                    </div>
                    <Button variant="primary" type="submit" text="Uložit podnik i hodiny" />
                </div>
            </form>
        </div>
    );
};