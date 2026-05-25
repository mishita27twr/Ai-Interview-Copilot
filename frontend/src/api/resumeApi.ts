import axios from "axios";
import { ResumeUploadResponse } from "../types/resume";

const API_URL = import.meta.env.VITE_API_URL;

export const uploadResume = async (file: File): Promise<ResumeUploadResponse> => {
  const formData = new FormData();
  formData.append("resume", file);
  
  const response = await axios.post(`${API_URL}/api/resume/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  
  return response.data;
};
