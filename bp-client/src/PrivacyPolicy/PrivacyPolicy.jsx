import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button/Button";
import "./PrivacyPolicy.css"; 

export const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="custom-privacy-page">
            <div className="custom-privacy-content-wrapper">
                <h2>Zásady ochrany osobních údajů</h2>
                
                <p>Tyto zásady popisují, jak nakládáme s vašimi údaji v rámci naší aplikace pro zahradníky a květinářství.</p>

                <section>
                    <h3>1. Správce osobních údajů</h3>
                    <p>Provozovatel portálu (dále jen "my"), zpracovává osobní údaje v souladu s nařízením GDPR.</p>
                </section>

                <section>
                    <h3>2. Rozsah zpracování</h3>
                    <p>Zpracováváme pouze nezbytné údaje pro fungování služby:</p>
                    <ul>
                        <li><strong>Identifikační údaje:</strong> E-mailová adresa.</li>
                        <li><strong>Profilové údaje:</strong> Zvolená role (Zákazník / Business).</li>
                        <li><strong>Technické údaje:</strong> IP adresa, soubory cookies.</li>
                    </ul>
                </section>

                <section>
                    <h3>3. Účel a právní základ</h3>
                    <p>Údaje zpracováváme na základě plnění smlouvy (vytvoření účtu) a našeho oprávněného zájmu (zajištění bezpečnosti webu).</p>
                </section>

                <section>
                    <h3>4. Doba uchování</h3>
                    <p>Vaše údaje uchováváme po dobu trvání vašeho účtu nebo dokud neodvoláte svůj souhlas (pokud byl udělen).</p>
                </section>

                <section>
                    <h3>5. Vaše práva</h3>
                    <p>Máte právo požadovat výpis svých údajů, jejich opravu nebo úplné smazání z naší databáze.</p>
                </section>
                <div className="custom-privacy-back-button-container">
                    <Button 
                        variant="primary" 
                        type="button" 
                        text="Zpět k registraci" 
                        onClick={() => navigate(-1)} 
                    />
                </div>
            </div>
        </div>
    );
};