import React, { useState } from "react";
import "./Register.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { Input } from "../components/Input/Input";
import { Select } from "../components/Select/Select";
import { Button } from "../components/Button/Button";
import Error from "../components/Error/Error"
import { toast } from 'react-toastify';

export const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();
    const [serverErrors, setServerErrors] = useState([]);
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const roleOptions = [
        { value: "User", label: "Zákazník" },
        { value: "Business", label: "Zahradnictví/Květinářství" }
    ];

    const onSubmit = data => {
        setServerErrors([]); 
        axios.post(`${API_BASE_URL}/Auth/Register`, {
            email: data.email, 
            password: data.password,
            role: data.role
        })
        .then(response => {
            navigate("/login"); 
            toast.success("Profil byl úspěšně vytvořen");
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const apiData = error.response.data;
                if (Array.isArray(apiData)) {
                    setServerErrors(apiData);
                } 
                else if (apiData.message) {
                    setServerErrors([{ description: apiData.message }]);
                } else {
                    setServerErrors([{ description: "Registrace se nezdařila" }]);
                }
            } else {
                setServerErrors([{ description: "Server neodpovídá" }]);
            }
            console.error("Chyba při registraci:", error.response?.data);
        });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                <h2>Registrace</h2>
                <Input
                    label="Emailová adresa"
                    type="email"
                    error={errors.email}
                    {...register("email", { required: "Email musíte vyplnit" })}
                    placeholder="napište svůj email..."
                />
                <Input
                    label="Heslo"
                    type="password"
                    error={errors.password}
                    {...register("password", { 
                        required: "Heslo je povinné",
                        minLength: { value: 6, message: "Heslo musí mít aspoň 6 znaků" }
                    })}
                    placeholder="zadejte heslo..."
                />
                <Input
                    label="Heslo znovu"
                    type="password"
                    {...register("confirmPassword", { 
                        validate: (val) => {
                            if (watch('password') !== val) {
                            return "Hesla se neshodují";
                            }
                        },
                    })}
                    error={errors.confirmPassword}
                />
                <Select
                    label="Role"
                    error={errors.role}
                    options={roleOptions}
                    {...register("role", { required: "Role je povinná" })}
                />
                <div className="gdpr-checkbox-container">
                    <div className="checkbox-row">
                        <input
                            type="checkbox"
                            id="gdpr"
                            {...register("gdpr", { 
                                required: "Pro registraci musíte souhlasit se zpracováním údajů" 
                            })}
                        />
                        <label htmlFor="gdpr">
                            Souhlasím se <a href="/ochrana-soukromi" target="_blank" rel="noopener noreferrer">zpracováním osobních údajů</a>
                        </label>
                    </div>
                    {errors.gdpr && <span className="error-text">{errors.gdpr.message}</span>}
                </div>
                 <Error serverErrors={serverErrors}/>
                <Button variant="primary" type="submit" text="Registrovat se"/>
            </form>
        </div>
    );
};