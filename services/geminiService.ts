import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, ModelOption } from "../types";
import { DEFAULT_SYSTEM_INSTRUCTION } from "../constants";

// Helper to fetch models via REST as requested to avoid 404s and get a list
export const fetchAvailableModels = async (apiKey: string): Promise<ModelOption[]> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) {
      throw new Error("Failed to fetch models. Check API Key.");
    }
    const data = await response.json();
    
    // Filter for models that support generateContent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const models = data.models.filter((m: any) => 
      m.supportedGenerationMethods && 
      m.supportedGenerationMethods.includes("generateContent")
    ).map((m: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      name: m.name.replace('models/', ''),
      displayName: m.displayName,
      version: m.version,
      description: m.description
    }));

    return models;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
};

export const analyzeResume = async (
  apiKey: string,
  modelName: string,
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Please analyze the following Resume against the Job Description.

    JOB DESCRIPTION:
    ${jobDescription}

    RESUME CONTENT:
    ${resumeText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Match score between 0 and 100" },
            reasoning: { type: Type.STRING, description: "Brief explanation of the score" },
            key_skills: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of matching skills found"
            },
            recommendation: { 
              type: Type.STRING, 
              enum: ["Shortlist", "Reject", "Review"],
              description: "Final hiring recommendation"
            }
          },
          required: ["score", "reasoning", "key_skills", "recommendation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text generated");
    
    return JSON.parse(text) as AnalysisResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
