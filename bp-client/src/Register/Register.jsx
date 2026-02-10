import React, { useState } from "react";
import "./Register.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { useAuthContext, SET_ACCESS_TOKEN } from "../Providers/AuthProvider"; 
import { Input } from "../components/Input/Input";
import { Select } from "../components/Select/Select";
import { Button } from "../components/Button/Button";
import Error from "../components/Error/Error"

export const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [, dispatch] = useAuthContext();
    const [serverErrors, setServerErrors] = useState([]);
    const roleOptions = [
        { value: "User", label: "Zákazník" },
        { value: "Business", label: "Zahradnictví/Květinářství" }
    ];

    const onSubmit = data => {
        setServerErrors([]); 
        axios.post("https://localhost:7014/api/Auth/Register", {
            email: data.email, 
            password: data.password,
            role: data.role
        })
        .then(response => {
            navigate("/login"); 
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
                <Select
                    label="Role"
                    error={errors.role}
                    options={roleOptions}
                    {...register("role", { required: "Role je povinná" })}
                />
                 <Error serverErrors={serverErrors}/>
                <Button variant="primary" type="submit" text="Registrovat se"/>
            </form>
        </div>
    );
};