import React, { useState } from "react";
import "./Register.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { Input } from "../components/Input/Input";
import { Select } from "../components/Select/Select";
import { Button } from "../components/Button/Button";
import Error from "../components/Error/Error";
import Loading from "../components/Loading/Loading";
import { GoogleLogin } from '@react-oauth/google'; 
import { toast } from 'react-toastify';
import { useAuthContext, SET_ACCESS_TOKEN } from "../Providers/AuthProvider"; 


export const Register = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
    const navigate = useNavigate();
    const [, dispatch] = useAuthContext();
    const [serverErrors, setServerErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false); 
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const roleOptions = [
        { value: "User", label: "Zákazník" },
        { value: "Business", label: "Zahradnictví/Květinářství" }
    ];

    const handleLoginSuccess = (token) => {
            localStorage.setItem("token", token);
            dispatch({ type: SET_ACCESS_TOKEN, payload: token });
            navigate("/uzivatel");
            toast.success("Registrace proběhla úspěšně")
    };

    const onSubmit = async (data) => { 
        setServerErrors([]); 
        try {
            await axios.post(`${API_BASE_URL}/Auth/Register`, {
                email: data.email, 
                password: data.password,
                role: data.role
            });
            navigate("/login"); 
            toast.success("Profil byl úspěšně vytvořen");
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleApiError = (error) => {
        if (error.response && error.response.data) {
            const apiData = error.response.data;
            if (Array.isArray(apiData)) {
                setServerErrors(apiData);
            } else if (apiData.message) {
                setServerErrors([{ description: apiData.message }]);
            } else {
                setServerErrors([{ description: "Akce se nezdařila" }]);
            }
        } else {
            setServerErrors([{ description: "Server neodpovídá" }]);
        }
    };

    const onGoogleSuccess = async (credentialResponse) => {
        setServerErrors([]);
        setIsLoading(true); 
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/google`, {
                idToken: credentialResponse.credential,
                selectedRole: "user" 
            });
            if (response.data.token) {
                handleLoginSuccess(response.data.token);
            }
        } catch (error) {
            handleApiError(error);
            setIsLoading(false);
        }
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
                    error={errors.confirmPassword}
                    {...register("confirmPassword", { 
                        required: "Potvrzení hesla je povinné",
                        validate: (val) => {
                            if (watch('password') !== val) {
                                return "Hesla se neshodují";
                            }
                        },
                    })}
                    placeholder="zopakujte heslo..."
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
                    {errors.gdpr && <span className="error-text" style={{color: 'red', fontSize: '12px'}}>{errors.gdpr.message}</span>}
                </div>
                <Error serverErrors={serverErrors}/>
                <Button 
                    variant="primary" 
                    type="submit" 
                    text="Registrovat se" 
                    disabled={isSubmitting || isLoading}
                />
                <div className="separator">nebo</div>
                <div className="google-btn-container">
                    {isLoading ? (
                        <Loading message="Probíhá registrace..."/>
                    ) : (
                        <GoogleLogin
                            onSuccess={onGoogleSuccess}
                            onError={() => {
                                setServerErrors([{ description: "Google registrace selhala" }]);
                                setIsLoading(false);
                            }}
                            useOneTap
                        />
                    )}
                </div>
            </form>
        </div>
    );
};