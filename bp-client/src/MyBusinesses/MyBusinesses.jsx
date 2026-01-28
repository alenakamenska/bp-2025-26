import React from "react";
import "./MyBussinesses.css"; 
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { useAuthContext } from "../Providers/AuthProvider";
import { useState, useEffect } from "react";
import Card from "../components/Card/card"

export const MyBusiness = () => {
    const [businesses, setBusinesses] = useState([]);
    const navigate = useNavigate();
    const [state] = useAuthContext(); 
    const userId = state.profile?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                   || state.profile?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"]
                   || state.profile?.sub
                   || state.profile?.nameid;    
    const [openningHours, setopenningHours] = useState([]);
    useEffect(() => {
        axios.get(`https://localhost:7014/api/Businesses/user/${userId}`, {
            headers: { Authorization: `Bearer ${state.accessToken}` }
        })
        .then(response => {
            setBusinesses(response.data);
        })
        .catch(err => console.error("Chyba při načítání:", err));
    }, [userId, state.accessToken]);
    useEffect(() => {
        axios.get("https://localhost:7014/api/OpeningHours")
        .then(response => {
            setopenningHours(response.data);
        })
        .catch(err => console.error("Chyba při načítání:", err));
    }, []);
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
        const businessResponse = await axios.post(
            "https://localhost:7014/api/Businesses", 
            businessPayload, 
            { headers: { Authorization: `Bearer ${state.accessToken}` } }
        );

        const newBusinessId = businessResponse.data.id;

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
    }
};
return (
    <div className="business-page">
        <h2>Moje podniky</h2>
        <div className="businesses-grid">
        {businesses.map((b) => (
            <Card 
            key={b.id}
            image={b.imageURL}      
            name={b.name}
            street={b.street}
            houseNumber={b.houseNumber}
            city={b.city}
            id = {b.id}
            owner={true}            
            />
        ))}
        </div>
        <h2>Přidat podnik</h2> 
        <form onSubmit={handleSubmit(onSubmit)} className="business-flex-form">
            <div className="form-column">
                 <Input label="Název firmy" {...register("name", { required: "Povinné" })} />
                 <Input label="Město" {...register("city")} />
                 <Input label="Ulice" {...register("street")} />
                 <Input label="Číslo popisné" {...register("houseNumber")} />
                 <Input label="URL obrázku" {...register("imageURL")} />
                 <label>Popis firmy</label>
                 <textarea className="custom-textarea" {...register("info")} rows="3" />
            </div>
            <div className="form-column">
                <h3>Otevírací hodiny</h3>
                {fields.map((field, index) => (
                    <div key={field.id} className="opening-hours-row">
                        <span className="day-label">{field.day}</span>
                        <input type="hidden" {...register(`openingHours.${index}.day`)} />
                        
                        <input 
                            type="time" 
                            {...register(`openingHours.${index}.start`)} 
                            className="time-input"
                        />
                        <span className="time-separator">až</span>
                        <input 
                            type="time" 
                            {...register(`openingHours.${index}.end`)} 
                            className="time-input"
                        />
                    </div>
                ))}
                <Button variant="primary" type="submit" text="Uložit firmu" />
            </div>
        </form>
    </div>
);
}