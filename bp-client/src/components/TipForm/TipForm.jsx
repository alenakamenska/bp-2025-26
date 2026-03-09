import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../Input/Input";
import { Button }from "../Button/Button";
import { Select } from "..//Select/Select";
import { TextArea } from "../TextArea/TextArea";

export const TipForm = ({ initialData = {}, onSubmit, isSubmitting, categoryOptions,title = "Přidat radu" }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData
    });
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const handleInternalSubmit = (data) => {
        onSubmit({
            ...data,
            newCategoryName: showNewCategory ? newCategoryName : null
        });
    };

    return (
        <form onSubmit={handleSubmit(handleInternalSubmit)} className="login-form">
            <h2>{title}</h2>
            <Input
                label="Název rady"
                type="text"
                error={errors.name}
                {...register("name", { required: "Název musíte vyplnit" })}
            />
            <div className="selects" style={{ gap: '15px', marginBottom: '15px' }}>
                <div className="category-section">
                    {!showNewCategory ? (
                        <div className="flex-row" style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                            <Select 
                                label="Kategorie" 
                                options={categoryOptions} 
                                {...register("categoryId")} 
                            />
                            <Button 
                                type="button" 
                                text="Nová" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowNewCategory(true);
                                }} 
                            />
                        </div>
                    ) : (
                        <div className="flex-row" style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                            <Input 
                                label="Název nové kategorie" 
                                value={newCategoryName} 
                                onChange={(e) => setNewCategoryName(e.target.value)} 
                            />
                            <Button 
                                type="button" 
                                text="Zpět" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowNewCategory(false);
                                }} 
                            />
                        </div>
                    )}
                </div>
            </div>
            <label className="form-label">Popis rady</label>
            <TextArea
                {...register("info", { required: "Popis je povinný" })}
            />
            <Button 
                variant="primary" 
                type="submit" 
                text={isSubmitting ? "Ukládám..." : "Uložit radu"} 
                disabled={isSubmitting} 
            />
        </form>
    );
};