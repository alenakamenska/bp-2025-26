import React, { useState } from "react"; 
import "./Login.css";
import { useForm } from "react-hook-form";
import axios from "axios"; 
import { useAuthContext, SET_ACCESS_TOKEN } from "../Providers/AuthProvider"; 
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import Error from "../components/Error/Error";
import { GoogleLogin } from '@react-oauth/google'; 
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading/Loading";

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [, dispatch] = useAuthContext();
    const [serverErrors, setServerErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const handleLoginSuccess = (token) => {
        localStorage.setItem("token", token);
        dispatch({ type: SET_ACCESS_TOKEN, payload: token });
        navigate("/uzivatel");
        toast.success("Přihlášení proběhlo úspěšně")
    };

    const onSubmit = data => {
        setServerErrors([]);
        axios.post(`${API_BASE_URL}/Auth/Login`, {
            email: data.email, 
            password: data.password
        })
        .then(response => {
            if (response.data.token) {
                handleLoginSuccess(response.data.token);
            }
        })
        .catch(error => {
            handleApiError(error);
        });
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

    const handleApiError = (error) => {
        if (error.response && error.response.data) {
            const data = error.response.data;
            if (Array.isArray(data)) {
                setServerErrors(data);
            } 
            else if (data.message) {
                setServerErrors([{ description: data.message }]);
            }
            else {
                setServerErrors([{ description: typeof data === 'string' ? data : "Chyba při přihlášení" }]);
            }
        } else {
            setServerErrors([{ description: "Server neodpovídá" }]);
        }
        console.error("API Error:", error.response?.data || error.message);
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
                <div className="forgot-password-link">
                    <Link to="/zapomenute-heslo">Zapomněli jste heslo?</Link>
                </div>
                <Error serverErrors={serverErrors} />
                <Button variant="primary" type="submit" text="Přihlásit se"/>
                <div className="separator">nebo</div>
                <div className="google-btn-container">
                    {isLoading ? (
                        <Loading message="Přihlašování"/>
                    ) : (
                        <GoogleLogin
                            onSuccess={onGoogleSuccess}
                            onError={() => {
                                setServerErrors([{ description: "Google přihlášení selhalo" }]);
                                setIsLoading(false);
                            }}
                            useOneTap
                            use_fedcm_for_prompt={true}
                        />
                    )}
                </div>
            </form>
        </div>
    );
};