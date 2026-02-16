import { Candidate } from './types';

const NAMES = [
  "Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Evans", "Ethan Harris",
  "Fiona Clark", "George Lewis", "Hannah Walker", "Ian Hall", "Julia Young",
  "Kevin Allen", "Laura Scott", "Michael King", "Nina Wright", "Oscar Lopez",
  "Paula Hill", "Quinn Green", "Rachel Adams", "Sam Baker", "Tina Nelson"
];

const ROLES = [
  "Frontend Engineer", "Backend Developer", "Data Scientist", "Product Manager", "UX Designer"
];

const SKILLS_POOL = [
  "React", "TypeScript", "Python", "Node.js", "AWS", "Docker", "Figma", 
  "SQL", "Machine Learning", "Kubernetes", "GraphQL", "Tailwind"
];

const generateMockCandidates = (count: number): Candidate[] => {
  return Array.from({ length: count }).map((_, i) => {
    const score = Math.floor(Math.random() * 60) + 40; // Random score 40-100
    const status = score > 80 ? 'Shortlisted' : score < 60 ? 'Rejected' : 'Pending';
    const role = ROLES[Math.floor(Math.random() * ROLES.length)];
    const skills = Array.from({ length: 3 }).map(() => SKILLS_POOL[Math.floor(Math.random() * SKILLS_POOL.length)]);
    
    return {
      id: `mock-${i}`,
      name: NAMES[i % NAMES.length],
      email: `${NAMES[i % NAMES.length].toLowerCase().replace(' ', '.')}@example.com`,
      resumeText: `Mock resume content for ${role}...`,
      jobDescription: `Job description for ${role}...`,
      score,
      status,
      analysis: `Automated mock analysis based on random score generation. Candidate shows proficiency in ${skills.join(', ')}.`,
      skills,
      role,
      timestamp: Date.now() - Math.floor(Math.random() * 1000000000),
    };
  });
};

export const INITIAL_CANDIDATES: Candidate[] = generateMockCandidates(20);

export const DEFAULT_SYSTEM_INSTRUCTION = `
You are an expert HR Technical Recruiter and Resume Scanner. 
Your task is to analyze a candidate's resume text against a specific job description. 
You must objectively evaluate the match based on skills, experience, and keywords.
Return a JSON object with a score (0-100), a concise reasoning string, a list of identified key skills, and a recommendation (Shortlist, Reject, or Review).
`;
