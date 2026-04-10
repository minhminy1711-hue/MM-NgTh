import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalysisResult {
  score: number;
  kneeAngle?: number;
  balance?: number;
  reps: number;
  feedback: string;
  errors: string[];
}

export async function analyzePosture(videoBase64: string, exerciseType: string): Promise<AnalysisResult> {
  const prompt = `
    Analyze this fitness video for ${exerciseType} technique. 
    Provide a detailed assessment including:
    1. A score from 0-100.
    2. Specific knee angle if applicable (for Squat/Lunges).
    3. Balance percentage (0-100).
    4. Number of successful repetitions.
    5. Constructive feedback.
    6. A list of specific form errors detected.

    Return the result in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "video/mp4",
                data: videoBase64,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            kneeAngle: { type: Type.NUMBER },
            balance: { type: Type.NUMBER },
            reps: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            errors: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["score", "reps", "feedback", "errors"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as AnalysisResult;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Không thể phân tích video. Vui lòng thử lại.");
  }
}
