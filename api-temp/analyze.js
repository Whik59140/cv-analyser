const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
require("dotenv").config();

// Initialize Express and CORS middleware
const app = require("express")();
const corsMiddleware = cors({ origin: "*" });
app.use(corsMiddleware);

// Initialize Multer for file handling
const upload = multer({ storage: multer.memoryStorage() });

// Vercel Serverless Function handler
export default async function handler(req, res) {
  // Use a middleware-like pattern to handle the request
  upload.single("resume")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ error: "File upload failed" });
    }

    try {
      const { jobDescription } = req.body;
      const resumeFile = req.file;

      if (!resumeFile) {
        return res.status(400).json({ error: "No resume file uploaded." });
      }
      if (!jobDescription) {
        return res.status(400).json({ error: "Job description is required." });
      }

      const resumeData = await pdfParse(resumeFile.buffer);
      const resumeText = resumeData.text;

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are an expert HR recruiter and resume analyst. Analyze the following resume against the job description with extreme attention to detail.

        Job Description:
        ${jobDescription}

        Resume:
        ${resumeText}

        Provide a comprehensive analysis in JSON format with these keys:
        - "matchPercentage": Overall percentage match (0-100)
        - "globalScore": Overall resume quality score from 1-10 (considering all factors)
        - "profileScore": Profile section score 1-10
        - "educationScore": Education relevance score 1-10
        - "experienceScore": Work experience quality score 1-10
        - "skillsScore": Skills alignment score 1-10
        - "formattingScore": Resume formatting/structure score 1-10
        - "missingKeywords": Array of important keywords from job description missing in resume
        - "strengthsFound": Array of key strengths identified in the resume
        - "detailedFeedback": Object with keys: "profile", "education", "experience", "skills", "formatting"
        - "priorityImprovements": Array of top 3 most critical improvements needed
        - "suggestions": Overall improvement recommendations

        Be thorough, specific, and constructive in your analysis. Your entire response must be a single valid JSON object.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const analysisResult = JSON.parse(cleanedText);
      
      res.status(200).json(analysisResult);
      
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: "Error analyzing resume." });
    }
  });
} 