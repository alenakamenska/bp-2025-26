import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../Providers/AuthProvider";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { Select } from "../components/Select/Select";

export const UserUpdate = () => {
    const [state] = useAuthContext();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");
    const roleOptions = [
        { value: "User", label: "Zákazník" },
        { value: "Business", label: "Zahradnictví/Květinářství" }
    ];
    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const res = await axios.get("https://localhost:7014/api/Users/user", {
                headers: { Authorization: `Bearer ${state.accessToken}` }
            });
            reset({
                email: res.data?.email || "",
                phoneNumber: res.data?.phoneNumber || "",
            role: (res.data?.roles && res.data.roles.length > 0) ? res.data.roles[0] : ""});
            setLoading(false);
        } catch (err) {
            console.error("Chyba při načítání profilu:", err);
            setLoading(false);
        }
    };

        if (state.accessToken) fetchUserData();
    }, [state.accessToken, reset]);

    const onUpdate = async (formData) => {
        try {
            setServerError("");
            await axios.put("https://localhost:7014/api/Users/update-profile", formData, {
                headers: { Authorization: `Bearer ${state.accessToken}` }
            });
            alert("Profil úspěšně aktualizován!");
        } catch (err) {
            setServerError("Aktualizace se nezdařila");
            console.error(err);
        }
    };

    if (loading) return <p>Načítám údaje...</p>;
    return (
        <div className="profile-container">
            <h2>Můj profil</h2>
            {serverError && <p style={{ color: "red" }}>{serverError}</p>}
            
            <form onSubmit={handleSubmit(onUpdate)}>
                <Input 
                    label="Email" 
                    {...register("email", { required: "Email je povinný" })} 
                    error={errors.email} 
                />
                <Input 
                    label="Telefonní číslo" 
                    {...register("phoneNumber")} 
                    error={errors.phoneNumber} 
                />
                 <Select
                    label="Role"
                    error={errors.role}
                    options={roleOptions}
                    {...register("role", { required: "Role je povinná" })}
                />
                <div style={{ marginTop: "20px" }}>
                    <Button type="submit" text="Uložit změny" className="primary" />
                </div>
            </form>
        </div>
    );
};