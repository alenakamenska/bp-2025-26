import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { FileInput } from "../FileInput/FileInput"; 
import "./BusinessForm.css";

export const BusinessForm = ({ onSubmit, accessToken, initialData = null }) => {
    const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
        defaultValues: initialData || {
            name: "",
            city: "",
            street: "",
            houseNumber: "",
            imageURL: "", 
            info: "",
            ICO: "",
            openingHours: [
                { day: "Pondělí", start: "08:00", end: "16:00", isClosed: false },
                { day: "Úterý", start: "08:00", end: "16:00", isClosed: false },
                { day: "Středa", start: "08:00", end: "16:00", isClosed: false },
                { day: "Čtvrtek", start: "08:00", end: "16:00", isClosed: false },
                { day: "Pátek", start: "08:00", end: "16:00", isClosed: false },
                { day: "Sobota", start: "08:00", end: "16:00", isClosed: false },
                { day: "Neděle", start: "08:00", end: "16:00", isClosed: false }
            ]
        }
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const { fields } = useFieldArray({ control, name: "openingHours" });
    const watchedHours = watch("openingHours");

    const handleAresFetch = async (ico) => {
        if (ico.length === 8) {
            try {
                const res = await axios.get(`https://localhost:7014/api/Businesses/ares/${ico}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                if (res.data) {
                    const d = res.data;
                    setValue("name", d.obchodniJmeno);
                    setValue("city", d.sidlo?.nazevObce || "");
                    setValue("street", d.sidlo?.nazevUlice || "");
                    const cp = d.sidlo?.cisloDomovni;
                    const co = d.sidlo?.cisloOrientacni;
                    setValue("houseNumber", co ? `${cp}/${co}` : `${cp}`);
                }
            } catch (err) { 
                console.warn("ARES error"); 
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="business-flex-form">
            <div className="form-column">
                <Input 
                    label="IČO" 
                    {...register("ICO", { 
                        required: "IČO je povinné",
                        onChange: (e) => handleAresFetch(e.target.value) 
                    })} 
                    error={errors.ICO}
                />
                <Input 
                    label="Název firmy" 
                    {...register("name", { required: "Název je povinný" })} 
                    error={errors.name} 
                />
                <Input label="Město" {...register("city")} />
                <Input label="Ulice" {...register("street")} />
                <Input label="Číslo popisné" {...register("houseNumber")} />
                <FileInput 
                    label="Logo zahradnictví"
                    initialImage={watch("imageURL")}
                    onUploadSuccess={(url) => setValue("imageURL", url)} 
                />
                <input type="hidden" {...register("imageURL")} />
                <label className="form-label">Popis firmy</label>
                <textarea 
                    className="custom-textarea" 
                    {...register("info")} 
                    rows="4" 
                />
            </div>
            <div className="form-column">
                <h3>Otevírací hodiny</h3>
                <p className="form-help-text">Přepnutím tlačítka nastavíte den jako zavřený.</p>
                {fields.map((field, index) => {
                    const isClosed = watchedHours[index]?.isClosed;
                    return (
                        <div key={field.id} className={`opening-hours-row ${isClosed ? "closed-day" : ""}`}>
                            <div className="day-control">
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        {...register(`openingHours.${index}.isClosed`)} 
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <span className="day-label">{field.day}</span>
                            </div>
                            {!isClosed ? (
                                <div className="time-inputs-wrapper">
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
                            ) : (
                                <div className="closed-status-wrapper">
                                    <span className="closed-label">Zavřeno</span>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div className="form-actions">
                    <Button 
                        type="submit" 
                        text={initialData ? "Aktualizovat profil" : "Uložit nový podnik"} 
                        className="primary-btn" 
                    />
                </div>
            </div>
        </form>
    );
};