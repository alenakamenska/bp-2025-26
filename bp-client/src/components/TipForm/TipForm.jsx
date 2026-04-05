import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { Select } from "..//Select/Select";
import { TextArea } from "../TextArea/TextArea";

export const TipForm = ({ initialData = {}, onSubmit, isSubmitting, categoryOptions, title = "Přidat radu" }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData
    });
    const [showNewCategory, setShowNewCategory] = useState(false);

    const handleInternalSubmit = (data) => {
        onSubmit({
            ...data,
            newCategoryName: showNewCategory ? data.newCategoryName : null
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
                        <div className="flex-row">
                            <Select 
                                label="Kategorie" 
                                options={categoryOptions} 
                                {...register("categoryId")} 
                            />
                            <Button 
                                type="button" 
                                text="Nová" 
                                onClick={() => setShowNewCategory(true)} 
                            />
                        </div>
                    ) : (
                        <div className="flex-row" >
                            <Input 
                                label="Název nové kategorie" 
                                error={errors.newCategoryName}
                                {...register("newCategoryName", { 
                                    required: showNewCategory ? "Zadejte název kategorie" : false 
                                })}
                            />
                            <Button 
                                type="button" 
                                text="Zpět" 
                                onClick={() => setShowNewCategory(false)} 
                            />
                        </div>
                    )}
                </div>
            </div>
            <TextArea
                label="Popis rady"
                error={errors.info}
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