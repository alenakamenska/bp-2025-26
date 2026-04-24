import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuthContext, SET_ACCESS_TOKEN } from "../Providers/AuthProvider"; 
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { Select } from "../components/Select/Select";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading";

export const UserUpdate = () => {
    const [state, dispatch] = useAuthContext();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    const roleOptions = [
        { value: "User", label: "Zákazník" },
        { value: "Business", label: "Zahradnictví/Květinářství" }
    ];
    const isGoogleUser = state.profile?.idp === "Google" || 
                       state.profile?.iss?.includes("google") || 
                       state.profile?.sub?.startsWith("google-oauth2");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/Users/user`, {
                    headers: { Authorization: `Bearer ${state.accessToken}` }
                });
                reset({
                    email: res.data?.email || "",
                    phoneNumber: res.data?.phoneNumber || "",
                    role: (res.data?.roles && res.data.roles.length > 0) ? res.data.roles[0] : ""
                });
                setLoading(false);
            } catch (err) {
                console.error("Chyba při načítání uživatele:", err);
                setLoading(false);
            }
        };
        if (state.accessToken) fetchUserData();
    }, [state.accessToken, reset, API_BASE_URL]); 

    const onUpdate = async (formData) => {
        try {
            setServerError("");
            const response = await axios.put(`${API_BASE_URL}/Users/update-profile`, formData, {
                headers: { Authorization: `Bearer ${state.accessToken}` }
            });
            
            if (response.data && response.data.token) {
                dispatch({ 
                    type: SET_ACCESS_TOKEN, 
                    payload: response.data.token 
                });
                localStorage.setItem("token", response.data.token);
                toast.success("Profil byl úspěšně aktualizován");
            } else {
                toast.success("Profil byl úspěšně aktualizován");
            }
        } catch (err) {
            setServerError("Aktualizace se nezdařila");
            console.error(err);
            toast.error("Nepodařilo se uložit změny");
        }
    };

    if (loading) return <Loading/>;

    return (
        <div className="profile-container">
            <h2>Můj profil</h2>
            {serverError && <p className="error-message" style={{ color: "red" }}>{serverError}</p>}
            <form onSubmit={handleSubmit(onUpdate)}>
                <Input 
                    label="Email" 
                    {...register("email", { required: "Email je povinný" })} 
                    error={errors.email} 
                    disabled={isGoogleUser}
                />
              <Input 
                    label="Telefonní číslo" 
                    {...register("phoneNumber", {
                        pattern: {
                            value: /^(\+?\d{1,3})?\s?\d{3}\s?\d{3}\s?\d{3}$/,
                            message: "Zadejte platné telefonní číslo"
                        }
                    })} 
                    error={errors.phoneNumber} 
                />
                 <Select
                    label="Role"
                    error={errors.role}
                    options={roleOptions}
                    {...register("role", { required: "Role je povinná" })}
                />
                <div style={{ marginTop: "20px" }}>
                    <Button type="submit" text="Uložit změny" className="primary" disabled={isSubmitting}/>
                </div>
            </form>
        </div>
    );
};