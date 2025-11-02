import { GoogleGenAI, Type } from "@google/genai";
import { Goal, Distribution, Mood } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDistributionSuggestion = async (income: number, goals: Goal[]): Promise<Distribution[]> => {
  const prompt = `
    Given a monthly income of ₹${income} and the following financial goals, create a smart fund distribution plan in Indian Rupees (₹).
    The plan should allocate a specific monthly amount to each goal and include essential categories like 'Living Expenses' and 'Discretionary Spending'.
    The total distribution must not exceed the monthly income.
    
    Goals:
    ${goals.map(g => `- ${g.name}: Target ₹${g.targetAmount}, Deadline ${g.deadline}, Priority ${g.priority}`).join('\n')}
    
    Return the plan as a JSON array of objects, where each object has a "name" (string) and a "value" (number) representing the allocated amount in INR.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        value: { type: Type.NUMBER },
                    },
                    required: ["name", "value"],
                },
            },
        },
    });

    const jsonText = response.text;
    const result = JSON.parse(jsonText);
    return result as Distribution[];

  } catch (error) {
    console.error("Error getting distribution suggestion:", error);
    throw new Error("Failed to get a distribution plan from the AI. Please try again.");
  }
};


export const runScenarioSimulation = async (scenario: string, goals: Goal[], currentPlan: Distribution[]): Promise<string> => {
    const prompt = `
    **Financial "What If" Scenario Analysis (Currency: INR)**

    **Current Situation:**
    - Financial Goals: ${JSON.stringify(goals.map(g => ({ name: g.name, target: `₹${g.targetAmount}`, current: `₹${g.currentAmount}`, deadline: g.deadline })))}
    - Current Monthly Savings Plan: ${JSON.stringify(currentPlan.filter(p => goals.some(g => g.name === p.name)))}
    
    **Scenario to Analyze:**
    "${scenario}"

    **Task:**
    Analyze the impact of the given scenario on the financial goals. 
    Calculate and state the new estimated completion date for each goal.
    Provide a concise, clear summary of the results. Respond in markdown format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error running scenario simulation:", error);
        throw new Error("Failed to run the scenario simulation. Please try again.");
    }
}

export const getMoodBasedTip = async (mood: Mood, goals: Goal[]): Promise<string> => {
    const prompt = `
    A user is managing their personal finances. 
    Their current financial goals are: ${goals.map(g => g.name).join(', ')}.
    They are currently feeling: **${mood}**.

    Based on their mood and goals, provide a single, short, empathetic, and actionable financial tip. 
    The tip should be encouraging and no more than two sentences.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting mood-based tip:", error);
        throw new Error("Failed to get a personalized tip. Please try again.");
    }
}
