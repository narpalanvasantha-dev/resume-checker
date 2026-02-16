import React, { useState } from 'react';
import { Candidate, Settings as SettingsType } from '../types';
import { analyzeResume } from '../services/geminiService';
import { Upload, FileText, Briefcase, Play, AlertCircle } from 'lucide-react';

interface ScannerProps {
  settings: SettingsType;
  onAnalysisComplete: (candidate: Candidate) => void;
}

const Scanner: React.FC<ScannerProps> = ({ settings, onAnalysisComplete }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!settings.apiKey) {
      setError("Please configure your API Key in Settings first.");
      return;
    }
    if (!resumeText || !jobDescription || !name) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const result = await analyzeResume(
        settings.apiKey, 
        settings.model || 'gemini-2.5-flash', 
        resumeText, 
        jobDescription
      );

      const newCandidate: Candidate = {
        id: crypto.randomUUID(),
        name,
        role,
        email: 'manual.entry@example.com', // Placeholder for manual entry
        resumeText,
        jobDescription,
        score: result.score,
        status: result.recommendation === 'Shortlist' ? 'Shortlisted' : result.recommendation === 'Reject' ? 'Rejected' : 'Pending',
        analysis: result.reasoning,
        skills: result.key_skills,
        timestamp: Date.now()
      };

      onAnalysisComplete(newCandidate);
      // Reset form
      setName('');
      setRole('');
      setResumeText('');
      setJobDescription('');
      alert("Analysis Complete!");
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Upload className="w-5 h-5 text-indigo-600" />
          New Application
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Candidate Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Target Role</label>
            <input 
              type="text" 
              value={role} 
              onChange={e => setRole(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Frontend Dev"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Resume / CV Text
          </label>
          <textarea 
            value={resumeText} 
            onChange={e => setResumeText(e.target.value)}
            className="flex-1 w-full p-3 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none resize-none text-sm font-mono"
            placeholder="Paste raw resume text here..."
          />
        </div>
      </div>

      {/* JD Section */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Job Context
          </h2>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Job Description</label>
          <textarea 
            value={jobDescription} 
            onChange={e => setJobDescription(e.target.value)}
            className="flex-1 w-full p-3 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none resize-none text-sm font-mono"
            placeholder="Paste job requirements and description here..."
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button 
          onClick={handleAnalyze}
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition
            ${isProcessing 
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
            }`}
        >
          {isProcessing ? (
            <>Processing via {settings.model || 'Gemini'}...</>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              Analyze Candidate
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Scanner;
