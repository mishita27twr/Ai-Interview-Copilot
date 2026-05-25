import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/generate", async (req, res) => {
  try {
    const { role, difficulty, analysis } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an expert AI interviewer. Generate unique, resume-based interview questions. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `
Generate 5 unique interview questions.

Role: ${role}
Difficulty: ${difficulty}

Resume Analysis:
${JSON.stringify(analysis, null, 2)}

Question mix:
- 2 skill-based technical questions
- 1 project-based question
- 1 scenario/problem-solving question
- 1 HR/communication question

Return ONLY this JSON format:

{
  "questions": [
    {
      "id": "q1",
      "text": "",
      "topic": ""
    }
  ]
}
          `,
        },
      ],
    });

    const raw = completion.choices[0].message.content;

let parsed;

try {
  parsed = JSON.parse(raw);
} catch {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
}

if (!parsed || !Array.isArray(parsed.questions)) {
  parsed = {
    questions: [
      {
        id: "q1",
        text: `Tell me about one project you built that is most relevant to ${role}.`,
        topic: "Project"
      },
      {
        id: "q2",
        text: `Which technical skill are you strongest in for the ${role} role, and why?`,
        topic: "Skills"
      },
      {
        id: "q3",
        text: `Explain one challenge you faced while building your project and how you solved it.`,
        topic: "Problem Solving"
      },
      {
        id: "q4",
        text: `What would you improve in your current projects if you had more time?`,
        topic: "Improvement"
      },
      {
        id: "q5",
        text: `Why do you think you are suitable for a ${role} position?`,
        topic: "HR"
      }
    ]
  };
}
res.json({
  success: true,
  questions: parsed.questions,
});

    res.json({
      success: true,
      questions: parsed.questions,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Question generation failed",
      error: error.message,
    });
  }
});

export default router;