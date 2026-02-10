import React, { useState } from "react"; 
import "./Add-tip.css"; 
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { useAuthContext } from "../Providers/AuthProvider";

export const AddTip = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [state] = useAuthContext();
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const userId = state.profile?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                    || state.profile?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"]
                    || state.profile?.sub
                    || state.profile?.nameid;
        
        const payload = {
            name: data.name,
            info: data.info,
            userId: userId 
        };
        try {
            const response = await axios.post("https://localhost:7014/api/Tips", payload, {
                headers: { Authorization: `Bearer ${state.accessToken}` }
            });
            navigate("/rady");
        } catch (error) {
            console.error("Chyba při ukládání rady:", error.response?.data || error.message);
            alert("Nepodařilo se uložit radu. Zkuste to prosím znovu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container"> 
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                <h2>Přidat radu</h2>
                <Input
                    label="Název rady"
                    type="text"
                    error={errors.name}
                    {...register("name", { required: "Název musíte vyplnit" })}
                    placeholder="Např. Jak zalévat rajčata..."
                />
                <label className="form-label">Popis rady</label>
                <textarea
                    rows="5"
                    className={`form-textarea ${errors.info ? 'error-border' : ''}`}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px' }} 
                    {...register("info", { 
                        required: "Popis je povinný",
                        minLength: { value: 10, message: "Popis musí být delší než 10 znaků" }
                    })}
                    placeholder="Podrobný popis vaší rady..."
                />
                {errors.info && <span className="error-text">{errors.info.message}</span>}
                <Button 
                    variant="primary" 
                    type="submit" 
                    text={isSubmitting ? "Ukládám..." : "Uložit radu"} 
                    disabled={isSubmitting} 
                />
            </form>
        </div>
    );
};