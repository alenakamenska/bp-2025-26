import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { FileInput } from "../FileInput/FileInput"; 
import "./BusinessForm.css";
import { AddColleague } from "../AddColeague/AddColleague";

export const BusinessForm = ({ onSubmit, accessToken, initialData = null }) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    const { register, control, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: initialData || {
            name: "",
            city: "",
            street: "",
            houseNumber: "",
            imageURL: "", 
            info: "",
            ICO: "",
            isVerified: false,
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
                const res = await axios.get(`${API_BASE_URL}/Businesses/ares/${ico}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                if (res.data && res.data.data) {
                    const ares = res.data.data; 
                    setValue("name", ares.obchodniJmeno);
                    setValue("city", ares.sidlo?.nazevObce || "");
                    setValue("street", ares.sidlo?.nazevUlice || "");
                    const cp = ares.sidlo?.cisloDomovni;
                    const co = ares.sidlo?.cisloOrientacni;
                    setValue("houseNumber", co ? `${cp}/${co}` : `${cp}`);
                    setValue("isVerified", res.data.isVerified);
                }
            } catch (err) { 
                console.warn("ARES error", err); 
            }
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)} className="business-flex-form">
            <div className="form-column">
                <FileInput 
                    label="Logo podniku"
                    initialImage={watch("imageURL")}
                    onUploadSuccess={(url) => setValue("imageURL", url)} 
                />
                <input type="hidden" {...register("imageURL")} />
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
                        disabled={isSubmitting}
                    />
                </div>
            </div>
        </form>
        {initialData && initialData.id && (
            <div className="form-section-separator">
                <hr />
                <AddColleague 
                    businessId={initialData.id} 
                    accessToken={accessToken} 
                    ownerId={initialData?.ownerId}                
                />
            </div>
        )}
        </>
    );
};