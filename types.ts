export interface Candidate {
  id: string;
  name: string;
  email: string;
  resumeText: string;
  jobDescription: string;
  score: number;
  status: 'Pending' | 'Shortlisted' | 'Rejected';
  analysis: string;
  skills: string[];
  role: string;
  timestamp: number;
}

export interface Settings {
  apiKey: string;
  model: string;
}

export interface ModelOption {
  name: string;
  displayName: string;
  version: string;
  description: string;
}

export interface AnalysisResponse {
  score: number;
  reasoning: string;
  key_skills: string[];
  recommendation: 'Shortlist' | 'Reject' | 'Review';
}
