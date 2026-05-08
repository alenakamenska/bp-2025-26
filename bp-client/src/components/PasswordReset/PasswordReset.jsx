import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { useAuthContext } from "../../Providers/AuthProvider";

export const PasswordReset = () => {
    const [state] = useAuthContext();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, watch } = useForm();
    const [message, setMessage] = useState("");
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const onSubmit = async (data) => {
        try {
            await axios.post(`${API_BASE_URL}/Users/change-password`, { 
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            }, {
                headers: { Authorization: `Bearer ${state.accessToken}` }
            });
            setMessage("Heslo bylo úspěšně změněno");
            reset(); 
        } catch (err) {
            setMessage("Chyba: " + (err.response?.data?.[0]?.description || "Nepodařilo se změnit heslo"));
        }
    };

    return (
        <div className="change-password-container">
            <h2>Změna hesla</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input 
                    label="Současné heslo" 
                    type="password" 
                    {...register("oldPassword", { required: "Zadejte staré heslo" })}
                    error={errors.oldPassword}
                />
                <Input 
                    label="Nové heslo" 
                    type="password" 
                    {...register("newPassword", { 
                        required: "Zadejte nové heslo",
                        minLength: { value: 8, message: "Heslo musí mít aspoň 8 znaků" }
                    })}
                    error={errors.newPassword}
                />
                <Input 
                    label="Potvrzení nového hesla" 
                    type="password" 
                    {...register("confirmPassword", { 
                        validate: (val) => {
                            if (watch('newPassword') !== val) {
                              return "Hesla se neshodují";
                            }
                        },
                    })}
                    error={errors.confirmPassword}
                />
                <Button type="submit" text="Aktualizovat heslo" className="primary" disabled={isSubmitting}/>
                {message && <p className="status-message">{message}</p>}
            </form>
        </div>
    );
};