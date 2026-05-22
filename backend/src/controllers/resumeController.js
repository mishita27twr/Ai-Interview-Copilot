import Groq from "groq-sdk";
import dotenv from "dotenv";
import { extractTextFromResume } from "../utils/extractText.js";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const resumeText = await extractTextFromResume(req.file);

    if (!resumeText || resumeText.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an AI resume analyzer. Extract useful interview preparation information from the resume.",
        },
        {
          role: "user",
          content: `
Analyze this resume and return ONLY valid JSON with this structure:

{
  "skills": [],
  "projects": [],
  "experience": [],
  "education": [],
  "suggestedRoles": [],
  "weakAreas": []
}

Resume:
${resumeText}
          `,
        },
      ],
    });

    const rawResponse = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      resumeText,
      analysis: rawResponse,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Resume analysis failed",
      error: error.message,
    });
  }
};