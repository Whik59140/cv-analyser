# AI Resume Analyzer - Job Fit Checker

A modern web application that helps job seekers check how well their resume matches specific job opportunities. Upload your CV, paste the job description, and get instant feedback on your chances of landing the interview!

## ✨ Features

- 🎯 **Job Match Analysis**: Get an instant percentage match between your resume and job requirements
- 📊 **Detailed Scoring**: Comprehensive scoring across 5 key areas (Profile, Education, Experience, Skills, Formatting)
- 🚨 **Priority Improvements**: Receive top 3 critical action items to boost your chances
- ✅ **Strengths Identification**: Discover what makes your resume stand out
- ⚠️ **Missing Keywords**: Find important keywords you should add to pass ATS systems
- 💡 **Expert Recommendations**: Get specific, actionable advice from AI HR expertise
- 📝 **Section-by-Section Feedback**: Detailed analysis of each resume section

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Gemini API key from Google AI Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-analyser
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Start backend (from backend directory)
   npm start
   
   # Start frontend (from frontend directory, in a new terminal)
   npm run dev
   ```

5. **Access the application**
   Open your browser and go to `http://localhost:5173`

## 🎨 User Experience

### Job Match Process
1. **Upload Your Resume**: Drop your PDF resume file
2. **Paste Job Description**: Copy the complete job posting you're applying for
3. **Get Instant Analysis**: Receive comprehensive feedback in seconds
4. **Review Your Chances**: See your match percentage and detailed scoring
5. **Take Action**: Follow priority improvements and recommendations

### Smart Analysis
The AI analyzes your resume across multiple dimensions:
- **Profile & Contact Info**: Completeness and professionalism
- **Education Relevance**: How well your education matches the role
- **Work Experience**: Relevance, progression, and quantifiable achievements
- **Skills Alignment**: Technical and soft skills matching
- **Formatting & Structure**: Resume readability and organization

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, Multer (file uploads), pdf-parse
- **AI**: Google Gemini 1.5-flash model
- **Styling**: Modern gradient design with responsive layout

## 📁 Project Structure

```
ai-analyser/
├── frontend/           # React TypeScript application
│   ├── src/
│   │   ├── components/ # Navigation components
│   │   ├── pages/      # Single analyzer page
│   │   └── ...
├── backend/           # Node.js Express server
│   ├── index.js       # Main server file with analysis endpoint
│   └── ...
└── README.md
```

## 💼 Perfect For

- Job seekers wanting to optimize their resumes
- Career changers targeting new industries
- Recent graduates entering the job market
- Professionals applying for competitive positions
- Anyone wanting to improve their resume quality

## 🔒 Privacy & Security

- No data storage - your resume is processed and immediately discarded
- Secure PDF processing
- No personal information retained
- Local analysis with external AI processing only

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Ready to land your dream job? Start analyzing your resume today! 🚀**
