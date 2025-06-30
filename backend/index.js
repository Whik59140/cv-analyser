const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).send("No resume file uploaded.");
    }

    const resumeData = await pdfParse(resumeFile.buffer);
    const resumeText = resumeData.text;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert HR recruiter and resume analyst. Analyze the following resume against the job description with extreme attention to detail. 

      Evaluate these specific areas:
      1. PROFILE/PERSONAL INFO: Assess completeness, professionalism, contact details
      2. EDUCATION: Relevance to the job, quality of institutions, grades/achievements
      3. WORK EXPERIENCE: Relevance, progression, accomplishments, quantifiable results
      4. SKILLS: Technical and soft skills alignment with job requirements
      5. FORMATTING: Structure, readability, professionalism, consistency
      6. CONTENT QUALITY: Language, action verbs, specificity, impact demonstration

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

      Be thorough, specific, and constructive in your analysis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Clean the response to make sure it's valid JSON
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    res.send(JSON.parse(cleanedText));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error analyzing resume.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 