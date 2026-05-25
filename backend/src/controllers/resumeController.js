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
    content: `
You are an expert AI resume parser and interview preparation assistant.

Your job:
1. Extract structured information from the resume.
2. Identify real skills, projects, tools, technologies, education, and experience.
3. Suggest suitable job roles.
4. Identify weak areas for interviews.
5. Return ONLY valid JSON. No markdown. No explanation.
    `,
  },
  {
    role: "user",
    content: `
Analyze this resume carefully and return ONLY valid JSON in this exact structure:

{
  "summary": "",
  "skills": {
    "programmingLanguages": [],
    "frontend": [],
    "backend": [],
    "databases": [],
    "aiMl": [],
    "tools": [],
    "softSkills": []
  },
  "projects": [
    {
      "name": "",
      "description": "",
      "techStack": [],
      "features": [],
      "possibleInterviewQuestions": []
    }
  ],
  "experience": [],
  "education": [],
  "suggestedRoles": [],
  "weakAreas": [],
  "interviewFocus": {
    "technicalTopics": [],
    "projectTopics": [],
    "hrTopics": []
  }
}

Rules:
- Extract only what is present or strongly implied in the resume.
- Do not invent fake projects.
- If something is missing, use an empty array.
- suggestedRoles should match the candidate profile.
- weakAreas should be based on missing or shallow resume details.
- possibleInterviewQuestions should be specific to each project.
- Return valid JSON only.

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