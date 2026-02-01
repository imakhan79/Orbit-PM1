
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePortfolioAudit = async (projects: any[]) => {
  const model = 'gemini-3-flash-preview';
  const dataString = projects.map(p => ({
    name: p.name,
    status: p.status,
    health: p.health,
    progress: p.progress,
    tasksCount: p.tasks?.length || 0,
    owner: p.ownerId
  }));

  const prompt = `As a Portfolio Director, audit the following organizational project data: ${JSON.stringify(dataString)}. 
  Identify: 
  1. Top 3 organizational risks.
  2. Resource bottlenecks (e.g., which owners have too many critical projects).
  3. One high-level recommendation for the next quarter.
  Keep it professional, concise, and executive-ready.`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Failed to generate portfolio audit. Please check your API connectivity.";
  }
};

export const generateProjectSummary = async (projectName: string, tasks: any[]) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Summarize progress for project "${projectName}" based on: ${JSON.stringify(tasks)}. Focus on blockers.`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Failed to generate AI summary.";
  }
};

export const generateProjectPlan = async (goal: string) => {
  const model = 'gemini-3-pro-preview';
  const prompt = `Given the project goal: "${goal}", generate a high-level project plan.
    Return a JSON object with: 
    - name (string)
    - description (string)
    - priority (High/Medium/Low)
    - initialTasks (array of 3-5 objects with title, description, and priority)`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            priority: { type: Type.STRING },
            initialTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const askOrbitAI = async (message: string, context: string) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Context: ${context}. User: ${message}`;
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  } catch (error) {
    return "I encountered an error. Please try again.";
  }
};
