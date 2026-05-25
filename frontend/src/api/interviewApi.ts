import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const generateInterviewQuestions = async (
  role: string,
  difficulty: string,
  analysis: any
) => {
  const response = await axios.post(`${API_URL}/api/interview/generate`, {
    role,
    difficulty,
    analysis,
  });

  return response.data.questions;
};
export const sendChatMessage = async (message: string) => {
  return `AI Coach: ${message}`;
};