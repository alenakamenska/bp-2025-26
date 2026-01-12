import React from "react";
import "./Login.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { useAuthContext, SET_ACCESS_TOKEN } from "../Providers/AuthProvider"; 
import { Input } from "../components/Input/Input";

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [, dispatch] = useAuthContext();
    const onSubmit = data => {
        axios.post("https://localhost:7149/api/Auth/Login", {
            email: data.email, 
            password: data.password
        })
        .then(response => {
          const token = response.data.token; 
          if (token) {
            localStorage.setItem("token", token);
            dispatch({ type: SET_ACCESS_TOKEN, payload: token });
            navigate("/");
            }
        })
        .catch(error => {
            console.error("Chyba při přihlášení:", error);
            alert(error);
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
              <button type="submit">Přihlásit se</button>
            </form>
        </div>
    );
};