import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import IconButton from "../iconButton"
import { CiTrash } from "react-icons/ci";
import "./AddColleague.css";
import { FaShieldAlt } from "react-icons/fa";

export const AddColleague = ({ businessId, accessToken, ownerId }) => {
    const [email, setEmail] = useState("");
    const [colleagues, setColleagues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const getCurrentUserId = () => {
        if (!accessToken) return null;
        try {
            const base64Url = accessToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        } catch (e) {
            return null;
        }
    };

    const currentUserId = getCurrentUserId();
    const isOwner = currentUserId === ownerId;

    const fetchColleagues = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Businesses/${businessId}/colleagues`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setColleagues(res.data);
        } catch (err) {
            console.error("Chyba při načítání kolegů", err);
        }
    }, [businessId, accessToken, API_BASE_URL]);
    useEffect(() => {
        if (businessId) {
            fetchColleagues();
        }
    }, [fetchColleagues, businessId]);

    const handleAddColleague = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });
        try {
            await axios.post(
                `${API_BASE_URL}/Businesses/${businessId}/add-colleague`,
                JSON.stringify(email),
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setMessage({ text: "Kolega byl úspěšně přidán!", type: "success" });
            setEmail("");
            fetchColleagues();
        } catch (err) {
            const errorMsg = err.response?.data || "Uživatel s tímto e-mailem neexistuje";
            setMessage({ text: errorMsg, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveColleague = async (userId) => {
        if (!window.confirm("Opravdu chcete tohoto kolegu odebrat ze správy podniku?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/Businesses/${businessId}/remove-colleague/${userId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setMessage({ text: "Kolega byl odebrán.", type: "success" });
            fetchColleagues();
        } catch (err) {
            setMessage({ text: "Nepodařilo se odebrat kolegu.", type: "error" });
        }
    };

    return (
        <div className="colleague-card">
            <h3>Správa týmu</h3>
            {isOwner ? (
                <section className="add-colleague-section">
                    <p className="help-text">Zadejte e-mail kolegy pro sdílení správy</p>
                    <form onSubmit={handleAddColleague} className="colleague-form">
                        <Input
                            label="E-mail kolegy"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="kolega@seznam.cz"
                            required
                        />
                        <Button
                            type="submit"
                            text={loading ? "Přidávám..." : "Přidat"}
                            className="secondary-btn"
                            disabled={loading}
                        />
                    </form>
                </section>
            ) : (
                <p className="help-text-readonly">Seznam členů týmu (pouze pro čtení)</p>
            )}
            {message.text && (
                <div className={`status-message ${message.type}`}>
                    {message.text}
                </div>
            )}
            <hr className="divider" />
            <section className="colleagues-list-section">
                <h4>Současní kolegové</h4>
                {colleagues.length > 0 ? (
                    <ul className="colleagues-list">
                        {colleagues.map((c) => (
                            <li key={c.id} className="colleague-item">
                                <div className="colleague-info">
                                    <span className="colleague-email">{c.email}</span>
                                    {c.id === ownerId && (
                                        <span className="owner-badge">
                                            <FaShieldAlt size={12} style={{ marginRight: "4px" }} /> Majitel
                                        </span>
                                    )}
                                </div>
                                {isOwner && c.id !== ownerId && (
                                    <IconButton
                                        icon={CiTrash}
                                        color="#ff4d4f"
                                        size={20}
                                        onClick={() => handleRemoveColleague(c.id)}
                                        title="Odebrat kolegu"
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="empty-text">Zatím jste nepřidali žádné kolegy.</p>
                )}
            </section>
        </div>
    );
};