
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProjectSummary = async (projectName: string, tasks: any[]) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Summarize the current progress and identify risks for the project "${projectName}" based on these tasks: ${JSON.stringify(tasks)}. Focus on key blockers and upcoming deadlines. Keep it professional and concise.`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI summary.";
  }
};

export const askOrbitAI = async (message: string, context: string) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `You are Orbit AI, a professional project management assistant. 
    Context of current workspace: ${context}
    User Question: ${message}
    Provide actionable, helpful advice for project managers.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again.";
  }
};
