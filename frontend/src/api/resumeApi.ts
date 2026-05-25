import axios from "axios";
import { ResumeUploadResponse } from "../types/resume";

const API_URL = "https://ai-interview-copilot-vugd.onrender.com/api/resume/upload";

export const uploadResume = async (file: File): Promise<ResumeUploadResponse> => {
  const formData = new FormData();
  formData.append("resume", file);
  
  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  
  return response.data;
};
