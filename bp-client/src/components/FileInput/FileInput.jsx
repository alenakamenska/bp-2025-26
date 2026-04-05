import React, { useState, useId } from "react";
import { uploadImage } from "../../Cloudinary.js";
import "./FileInput.css";

export const FileInput = ({ onUploadSuccess, label, initialImage = "" }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(initialImage);
    const inputId = useId();

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
                id={inputId}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden-file-input"
            />
            <label 
                htmlFor={inputId} 
                className={`custom-file-dropzone ${isUploading ? "uploading" : ""} ${preview ? "has-image" : ""}`}
            >
                {isUploading ? (
                    <div className="progress-container">
                        <span className="progress-text">Nahrávám... {uploadProgress}%</span>
                        <progress value={uploadProgress} max="100"></progress>
                    </div>
                ) : preview ? (
                    <div className="image-preview-wrapper">
                        <img src={preview} alt="Náhled" className="preview-image" />
                        <div className="preview-overlay">
                            <span>Změnit obrázek</span>
                        </div>
                    </div>
                ) : (
                    <div className="empty-upload-state">
                        <span className="upload-icon">📁</span>
                        <span className="upload-text">Klikněte pro výběr obrázku</span>
                        <span className="upload-subtext">Max. velikost 5 MB</span>
                    </div>
                )}
            </label>
        </div>
    );
};