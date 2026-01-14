import React from "react";
import "./Register.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { useAuthContext, SET_ACCESS_TOKEN } from "../Providers/AuthProvider"; 
import { Input } from "../components/Input/Input";
import {Select} from "../components/Select/Select"
import {Button} from "../components/Button/Button"


export const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [, dispatch] = useAuthContext();
    const roleOptions = [
        { value: "User", label: "Zákazník" },
        { value: "Manager", label: "Zahradnictví/Květinářství" }
    ];
    const onSubmit = data => {
        axios.post("https://localhost:7149/api/Auth/Register", {
            email: data.email, 
            password: data.password,
            role: data.role
        })
        .then(response => {
        const token = response.data.token; 
        if (token) {
            localStorage.setItem("token", token);
            dispatch({ type: SET_ACCESS_TOKEN, payload: token });
        }
            navigate("/login"); 
        })
        .catch(error => {
            console.error("Chyba při přihlášení:", error);
            alert(error);
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
                  {...register("password", { required: "Heslo je povinné" })}
                  placeholder="zadejte heslo..."
              />
              <Select
                  label="Role"
                  error={errors.role}
                  options={roleOptions}
                  {...register("role", { required: "Role je povinná" })}
              />
                <Button variant="primary" type="submit" text="Přihlásit se"/>
            </form>
        </div>
    );
};