module.exports = function handler(req, res) {
  console.log("Analyze API endpoint called!");
  console.log("Method:", req.method);
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  // Return a mock analysis result
  res.status(200).json({
    matchPercentage: 85,
    globalScore: 8,
    profileScore: 8,
    educationScore: 9,
    experienceScore: 8,
    skillsScore: 7,
    formattingScore: 9,
    missingKeywords: ["JavaScript", "React"],
    strengthsFound: ["Strong communication skills", "Leadership experience"],
    detailedFeedback: {
      profile: "Good profile section with clear contact information.",
      education: "Relevant educational background for the position.",
      experience: "Strong work experience with quantifiable achievements.",
      skills: "Good technical skills, could add more frameworks.",
      formatting: "Well-formatted and professional appearance."
    },
    priorityImprovements: [
      "Add more technical skills",
      "Include more quantifiable achievements",
      "Highlight leadership experience more prominently"
    ],
    suggestions: "Overall strong resume, focus on adding more specific technical skills and quantifying achievements with numbers."
  });
}; 