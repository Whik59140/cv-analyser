import { useState } from 'react';

interface DetailedFeedback {
  profile: string;
  education: string;
  experience: string;
  skills: string;
  formatting: string;
}

interface Analysis {
  matchPercentage: number;
  globalScore: number;
  profileScore: number;
  educationScore: number;
  experienceScore: number;
  skillsScore: number;
  formattingScore: number;
  missingKeywords: string[];
  strengthsFound: string[];
  detailedFeedback: DetailedFeedback;
  priorityImprovements: string[];
  suggestions: string;
}

function SingleAnalyzerPage() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('--- handleSubmit triggered ---');
    console.log('Resume file:', resume);
    console.log('Job Description:', jobDescription);

    if (!resume || !jobDescription) {
      console.error('Validation failed: Missing resume or job description.');
      setError('Please upload your resume AND paste the job description.');
      return;
    }

    console.log('Validation passed. Setting loading state.');
    setLoading(true);
    setError('');
    setAnalysis(null);

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDescription);

    try {
      console.log('Sending request to /api/analyze...');
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      console.log('Received response from server:', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        try {
          // Try to parse it as JSON, as a structured error is still possible
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Something went wrong with the analysis.');
        } catch (jsonError) {
          // If it's not JSON, it might be an HTML error page or plain text
          throw new Error(`Server returned an error: ${response.status} ${response.statusText}. Check console for details.`);
        }
      }

      console.log('Response is OK. Parsing JSON...');
      const data = await response.json();
      console.log('Analysis data received:', data);
      setAnalysis(data);
    } catch (err) {
      console.error('--- CATCH BLOCK ERROR ---');
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      console.log('--- FINALLY BLOCK ---');
      setLoading(false);
    }
  };

  const ScoreBar = ({ score, label }: { score: number; label: string }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-800">{score}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${
            score >= 8 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
            score >= 6 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
            'bg-gradient-to-r from-red-500 to-red-600'
          }`}
          style={{ width: `${(score / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const getChanceMessage = (matchPercentage: number) => {
    if (matchPercentage >= 85) return { text: "🎯 Excellent Match! You're a strong candidate!", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (matchPercentage >= 70) return { text: "✅ Good Match! You have solid chances!", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
    if (matchPercentage >= 55) return { text: "⚡ Decent Match! Some improvements needed.", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
    return { text: "🔧 Needs Work. Focus on key improvements.", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Job Match Analyzer
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload your resume and job description to discover your compatibility score, 
            get actionable feedback, and boost your chances of landing the interview.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 mb-12">
          <div className="p-6 sm:p-8 lg:p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                Ready to Check Your Match?
              </h2>
              <p className="text-gray-600 text-lg">
                Get instant AI-powered analysis of your resume against any job posting.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Resume Upload */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    📄 Upload Your Resume
                  </label>
                  <div className="relative group">
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      resume 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
                    }`}>
                      {resume ? (
                        <div className="text-green-600">
                          <div className="mx-auto h-12 w-12 mb-4 flex items-center justify-center bg-green-100 rounded-full">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="font-semibold text-lg">{resume.name}</p>
                          <p className="text-sm text-green-500 mt-1">✓ File uploaded successfully</p>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <div className="mx-auto h-12 w-12 mb-4 flex items-center justify-center">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="font-semibold text-lg mb-2">Drag & Drop Your Resume</p>
                          <p className="text-sm">or click to browse files</p>
                          <p className="text-xs text-gray-400 mt-2">PDF format only</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    💼 Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={12}
                    className="w-full p-6 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400 resize-none"
                    placeholder="Paste the complete job description here...

Include all details:
• Job title and company
• Required qualifications
• Responsibilities  
• Skills and experience needed
• Any specific requirements"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={loading || !resume || !jobDescription}
                  className="px-12 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[280px]"
                >
                  <div className="flex items-center justify-center space-x-3">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        <span>Analyzing Your Match...</span>
                      </>
                    ) : (
                      <>
                        <span>🎯</span>
                        <span>Analyze My Chances</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <div className="h-5 w-5 text-red-500 mr-3 flex-shrink-0">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {analysis && (
          <div className="space-y-8">
            
            {/* Match Score Card */}
            <div className={`${getChanceMessage(analysis.matchPercentage).bg} ${getChanceMessage(analysis.matchPercentage).border} border-2 rounded-3xl shadow-2xl p-8 sm:p-12 text-center`}>
              <div className="mb-8">
                <div className={`text-6xl sm:text-7xl lg:text-8xl font-black ${getChanceMessage(analysis.matchPercentage).color} mb-4`}>
                  {analysis.matchPercentage}%
                </div>
                <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${getChanceMessage(analysis.matchPercentage).color} mb-6`}>
                  {getChanceMessage(analysis.matchPercentage).text}
                </div>
                
                {/* Progress Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="w-full bg-white/50 rounded-full h-6 shadow-inner">
                    <div 
                      className={`h-6 rounded-full transition-all duration-2000 ease-out ${
                        analysis.matchPercentage >= 70 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                        analysis.matchPercentage >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ width: `${analysis.matchPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                    <div className="text-3xl font-bold text-gray-800">{analysis.globalScore}/10</div>
                    <div className="text-gray-600 font-medium">Resume Quality</div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                    <div className="text-3xl font-bold text-gray-800">{analysis.strengthsFound.length}</div>
                    <div className="text-gray-600 font-medium">Key Strengths</div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                    <div className="text-3xl font-bold text-gray-800">{analysis.priorityImprovements.length}</div>
                    <div className="text-gray-600 font-medium">Action Items</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-10 text-center">
                📊 Detailed Assessment
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <ScoreBar score={analysis.profileScore} label="👤 Profile & Contact Info" />
                  <ScoreBar score={analysis.educationScore} label="🎓 Education Relevance" />
                  <ScoreBar score={analysis.experienceScore} label="💼 Work Experience" />
                </div>
                <div className="space-y-6">
                  <ScoreBar score={analysis.skillsScore} label="🛠️ Skills Alignment" />
                  <ScoreBar score={analysis.formattingScore} label="📋 Formatting & Structure" />
                </div>
              </div>
            </div>

            {/* Action Items & Strengths Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Priority Improvements */}
              <div className="bg-red-50 border-2 border-red-200 rounded-3xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-4 rounded-full mr-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800">🚨 Priority Actions</h3>
                </div>
                <div className="space-y-4">
                  {analysis.priorityImprovements.map((improvement, index) => (
                    <div key={index} className="flex items-start bg-white/80 p-4 rounded-xl shadow-sm">
                      <div className="bg-red-200 text-red-800 font-bold text-sm px-3 py-1 rounded-full mr-4 mt-1 flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-red-800 font-medium">{improvement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-green-50 border-2 border-green-200 rounded-3xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 p-4 rounded-full mr-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-green-800">✅ Your Strengths</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {analysis.strengthsFound.map((strength, index) => (
                    <span 
                      key={index} 
                      className="bg-white/80 px-4 py-2 rounded-full text-green-800 font-medium border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="bg-yellow-100 p-4 rounded-full mr-4">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-yellow-800">⚠️ Missing Keywords</h3>
              </div>
              {analysis.missingKeywords && analysis.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {analysis.missingKeywords.map((keyword, index) => (
                    <span 
                      key={index} 
                      className="bg-white/80 px-4 py-2 rounded-full text-yellow-800 font-medium border border-yellow-200 shadow-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-yellow-700 font-bold text-xl">🎉 Excellent! No missing keywords found!</p>
                </div>
              )}
            </div>

            {/* Expert Feedback & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Detailed Feedback */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-8 text-center">📝 Expert Feedback</h3>
                <div className="space-y-4">
                  {Object.entries(analysis.detailedFeedback).map(([section, feedback]) => (
                    <details key={section} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden group" open={section === 'experience'}>
                      <summary className="p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between font-semibold text-gray-800">
                        <span>
                          {section === 'profile' ? '👤 Profile & Personal Information' :
                           section === 'education' ? '🎓 Education' :
                           section === 'experience' ? '💼 Work Experience' :
                           section === 'skills' ? '🛠️ Skills' :
                           '📋 Formatting & Structure'}
                        </span>
                        <svg className="w-5 h-5 text-gray-500 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed">{feedback}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              {/* Smart Recommendations */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full mr-4">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">💡 Smart Tips</h3>
                </div>
                <div className="bg-white/80 p-6 rounded-xl">
                  <p className="text-blue-800 leading-relaxed whitespace-pre-line">{analysis.suggestions}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleAnalyzerPage; 