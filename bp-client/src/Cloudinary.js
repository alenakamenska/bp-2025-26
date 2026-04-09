import axios from "axios";

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export const uploadImage = async (file, onProgress) => { 
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      }
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error.response?.data || error.message);
    return null;
  }
};

export const getOptimizedUrl = (url, width = 1200, height = null) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  let transformations = `f_auto,q_auto,w_${width}`;
  if (height) {
    transformations += `,h_${height},c_fill`;
  }
  return url.replace("/upload/", `/upload/${transformations}/`);
};