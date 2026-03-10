import React, { useState } from "react";
import { uploadImage } from "../../Cloudinary.js";
import "./FileInput.css";

export const FileInput = ({ onUploadSuccess, label, initialImage = "" }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(initialImage);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert("Soubor je příliš velký (max 5 MB)");
            return;
        }
        setIsUploading(true);
        setUploadProgress(0);
        const url = await uploadImage(file, (percent) => {
            setUploadProgress(percent);
        });

        if (url) {
            setPreview(url);
            onUploadSuccess(url); 
        } else {
            alert("Chyba při nahrávání obrázku");
        }
        setIsUploading(false);
    };

    return (
        <div className="image-upload-container">
            {label && <label className="form-label">{label}</label>}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="file-input"
            />
            {isUploading && (
                <div className="progress-container">
                    <progress value={uploadProgress} max="100"></progress>
                    <span className="progress-text">{uploadProgress}%</span>
                </div>
            )}
            {preview && (
                <div className="image-preview">
                    <img src={preview} alt="Náhled" />
                    <p className="success-msg">Obrázek nahrán</p>
                </div>
            )}
        </div>
    );
};