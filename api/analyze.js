const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");
const busboy = require("busboy");
require("dotenv").config();

// Helper to set CORS headers
const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// Helper to parse multipart/form-data
const parseMultipartForm = (req) => {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });
    const fields = {};
    const files = {};

    bb.on("file", (name, stream, info) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => {
        files[name] = {
          buffer: Buffer.concat(chunks),
          ...info,
        };
      });
    });

    bb.on("field", (name, val) => {
      fields[name] = val;
    });

    bb.on("close", () => resolve({ fields, files }));
    bb.on("error", (err) => reject(err));
    req.pipe(bb);
  });
};

const handler = async (req, res) => {
  console.log("=== API Handler Started ===");
  console.log("Request method:", req.method);

  try {
    console.log("Attempting to parse multipart form data...");
    const { fields, files } = await parseMultipartForm(req);
    console.log("Form parsing successful!");

    const jobDescription = fields.jobDescription;
    const resumeFile = files.resume;

    if (!resumeFile) {
      console.log("ERROR: No resume file uploaded");
      return res.status(400).json({ error: "No resume file uploaded." });
    }
    if (!jobDescription) {
      console.log("ERROR: No job description provided");
      return res.status(400).json({ error: "Job description is required." });
    }

    console.log("Parsing PDF...");
    const resumeData = await pdfParse(resumeFile.buffer);
    const resumeText = resumeData.text;
    console.log("PDF parsed successfully.");

    console.log("Initializing Gemini AI...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Gemini AI initialized");

    const prompt = `
        You are an expert HR recruiter and resume analyst. Analyze the following resume against the job description with extreme attention to detail.
        Job Description:
        ${jobDescription}
        Resume:
        ${resumeText}
        Provide a comprehensive analysis in JSON format. Your entire response must be a single valid JSON object with these exact keys: "matchPercentage", "globalScore", "profileScore", "educationScore", "experienceScore", "skillsScore", "formattingScore", "missingKeywords", "strengthsFound", "detailedFeedback", "priorityImprovements", "suggestions".
        The "detailedFeedback" value must be an object with these exact keys: "profile", "education", "experience", "skills", "formatting".
      `;

    console.log("Sending request to Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log("Raw Gemini response received.");

    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const analysisResult = JSON.parse(cleanedText);
    console.log("JSON parsing successful!");

    res.status(200).json(analysisResult);
    console.log("=== API Handler Completed Successfully ===");
  } catch (error) {
    console.error("=== API Handler Error ===");
    console.error(error);
    res.status(500).json({ error: "Error analyzing resume.", details: error.message });
  }
};

module.exports = allowCors(handler); 