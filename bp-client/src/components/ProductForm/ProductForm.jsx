import React, { useState, useEffect } from "react";
import "../ProductForm/ProductForm.css"
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { Select } from "../Select/Select";
import Error from "../Error/Error";
import IconButton from "../iconButton";
import { CiTrash } from "react-icons/ci";
import { TextArea } from "../TextArea/TextArea";
import {FileInput } from "../FileInput/FileInput"; 

export const ProductForm = ({ onSubmit, categoryOptions, serverErrors, initialData = null }) => {
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: initialData || {
            nameProduct: "",
            price: "",
            imageProductURL: "",
            infoProduct: "",
            categoryId: "",
            tips: [{ nameTip: "", text: "" }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "tips" 
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const handleInternalSubmit = async (data) => {
        const submissionData = {
            ...data,
            isNewCategory: showNewCategory,
            newCategoryName: newCategoryName
        };
        const success = await onSubmit(submissionData);
        if (success) {
            reset();
            setShowNewCategory(false);
            setNewCategoryName("");
        }
    };

    return (
        <form onSubmit={handleSubmit(handleInternalSubmit)} className="business-flex-form">
            <div className="form-column">
                <Input
                    label="Název produktu"
                    {...register("nameProduct", { required: "Název produktu je povinný" })}
                    error={errors.nameProduct}
                />
                <Input
                    label="Cena (Kč)"
                    type="number"
                    step="0.1"
                    {...register("price", { required: "Cena je povinná" })}
                    error={errors.price}
                />
                <FileInput
                    label="Obrázek produktu"
                    initialImage={watch("imageProductURL")}
                    onUploadSuccess={(url) => setValue("imageProductURL", url)} 
                />
                <input type="hidden" {...register("imageProductURL")} />
                <TextArea
                    label="Popis produktu"
                    placeholder="Napište podrobnosti o produktu..."
                    {...register("infoProduct")}
                    error={errors.infoProduct}
                />
                 <h3>Zařazení</h3>
                <div className="category-section">
                    {!showNewCategory ? (
                        <div className="flex-row">
                            <Select
                                label="Kategorie"
                                options={categoryOptions}
                                {...register("categoryId", { required: !showNewCategory })}
                                error={errors.categoryId}
                            />
                            <Button
                                type="button"
                                text="Nová kategorie"
                                onClick={() => setShowNewCategory(true)}
                            />
                        </div>
                    ) : (
                        <div className="flex-row">
                            <Input
                                label="Nová kategorie"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
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
            <div className="form-column">
                <div className="tips-dynamic-section">
                    <h3>Tipy k produktu</h3>
                    {fields.map((field, index) => (
                        <div key={field.id} className="dynamic-row">
                            <Input
                                label="Název rady"
                                {...register(`tips.${index}.nameTip`)} 
                            />
                            <TextArea
                                label="text rady"
                                placeholder="Např. Zalévat ke kořenům..."
                                {...register(`tips.${index}.text`)} 
                            />
                            <IconButton
                                icon={CiTrash}                                     
                                onClick={() => remove(index)}
                                color="var(--danger-color)"
                            />
                        </div>
                    ))}
                    <Button 
                        type="button" 
                        text="+ Přidat další tip" 
                        onClick={() => append({ nameTip: "", text: "" })} 
                        className="secondary"
                    />
                </div>
                <Error serverErrors={serverErrors} />
                <Button 
                    type="submit" 
                    className="primary" 
                    text={initialData ? "Aktualizovat produkt" : "Uložit produkt"} 
                />
            </div>
        </form>
    );
};