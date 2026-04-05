import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import "./ForgotPassword.css"

export const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await axios.post(`${API_BASE_URL}/auth/forgot-password`, { 
                email: data.email 
            });
            toast.success("Pokud je e-mail v naší databázi, odeslali jsme instrukce pro obnovu hesla");
            setTimeout(() => navigate("/login"), 3500);
        } catch (error) {
            console.error("Chyba při odesílání požadavku:", error);
            toast.error("Něco se nepovedlo. Zkuste to prosím znovu");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <div className="auth-card">
                <h2>Obnova hesla</h2>
                <p className="auth-subtitle">
                    Zadejte svou e-mailovou adresu, se kterou zde máte registraci
                </p>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Input
                        label="E-mailová adresa"
                        type="email"
                        error={errors.email}
                        {...register("email", { 
                            required: "E-mail je povinný",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Neplatná e-mailová adresa"
                            }
                        })}
                    />
                    <div>
                        <Button 
                            type="submit" 
                            text={isSubmitting ? "Odesílám..." : "Odeslat instrukce"} 
                            className="primary-btn" 
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
                <div className="auth-footer">
                    <Button 
                        type="button" 
                        onClick={() => navigate("/login")} 
                        text="Přihlášení"
                    />
                </div>
            </div>
        </div>
    );
};