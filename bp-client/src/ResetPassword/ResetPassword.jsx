import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch("newPassword");

    const onSubmit = async (data) => {
        if (!token || !email) {
            toast.error("Neplatný nebo vypršený odkaz pro obnovu hesla");
            return;
        }
        setIsSubmitting(true);
        try {
            await axios.post(`${API_BASE_URL}/auth/reset-password`, {
                email: email,
                token: token,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            });
            toast.success("Heslo bylo úspěšně změněno. Nyní se můžete přihlásit");
            navigate("/login");
        } catch (error) {
            //console.error("Reset error:", error.response?.data);
            toast.error("Odkaz je neplatný nebo již vypršel");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <div className="auth-card">
                <h2>Nastavení nového hesla</h2>
                <p className="auth-subtitle">Zadejte své nové bezpečné heslo</p>
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <Input
                        label="Nové heslo"
                        type="password"
                        placeholder="Minimálně 8 znaků"
                        error={errors.newPassword}
                        {...register("newPassword", { 
                            required: "Heslo je povinné",
                            minLength: { value: 8, message: "Heslo musí mít aspoň 8 znaků" }
                        })}
                    />
                    <Input
                        label="Potvrzení hesla"
                        type="password"
                        placeholder="Zadejte heslo znovu"
                        error={errors.confirmPassword}
                        {...register("confirmPassword", { 
                            required: "Potvrzení hesla je povinné",
                            validate: (value) => value === password || "Hesla se neshodují"
                        })}
                    />
                    <div>
                        <Button 
                            type="submit" 
                            text={isSubmitting ? "Ukládám..." : "Změnit heslo"} 
                            className="primary-btn" 
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};