import React, { useState } from "react"; 
import "./Login.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { useAuthContext, SET_ACCESS_TOKEN } from "../Providers/AuthProvider"; 
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import Error from "../components/Error/Error"; 

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [, dispatch] = useAuthContext();
    const [serverErrors, setServerErrors] = useState([]);

    const onSubmit = data => {
        setServerErrors([]);
        axios.post("https://localhost:7014/api/Auth/Login", {
            email: data.email, 
            password: data.password
        })
        .then(response => {
            const token = response.data.token; 
            if (token) {
                localStorage.setItem("token", token);
                dispatch({ type: SET_ACCESS_TOKEN, payload: token });
                navigate("/uzivatel");
            }
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const data = error.response.data;
                if (Array.isArray(data)) {
                    setServerErrors(data);
                } 
                else if (data.message) {
                    setServerErrors([{ description: data.message }]);
                }
                else if (typeof data === 'string') {
                    setServerErrors([{ description: data }]);
                }
            } else {
                setServerErrors([{ description: "Server neodpovídá" }]);
            }
            console.error("Chyba při přihlášení:", error.response?.data);
        });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                <h2>Přihlášení</h2>
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
                  {...register("password", { required: "Heslo je povinné" })}
                  placeholder="zadejte heslo..."
                />
                <Error serverErrors={serverErrors} />
                <Button variant="primary" type="submit" text="Přihlásit se"/>
            </form>
        </div>
    );
};