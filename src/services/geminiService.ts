import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Challenge } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generatePersonalizedChallenges(profile: UserProfile): Promise<Omit<Challenge, 'id'>[]> {
  const prompt = `
    You are an AI study coach for Moroccan students. 
    Generate 3 personalized study tasks/challenges for a student with the following profile:
    - Grade: ${profile.grade || 'Baccalaureate'}
    - Subjects: ${profile.subjects?.join(', ') || 'General'}
    - Preferred Study Times: ${profile.studyTimes?.join(', ') || 'Anytime'}
    - Diagnosis/Assessment: ${profile.diagnosis || 'General improvement'}

    The tasks should be practical, time-bound (e.g., 30-60 mins), and relevant to the Moroccan curriculum (Baccalaureate/Regional).
    Return the response in JSON format as an array of objects with the following properties:
    - title (string, in Arabic)
    - description (string, in Arabic)
    - points (number, between 30 and 100)
    - type (string, must be 'study' or 'quiz')
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              points: { type: Type.NUMBER },
              type: { type: Type.STRING, enum: ['study', 'quiz'] },
            },
            required: ['title', 'description', 'points', 'type'],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    
    const parsed = JSON.parse(text);
    return parsed.map((item: any) => ({
      ...item,
      isAI: true,
      userId: profile.uid,
      grade: profile.grade
    }));
  } catch (error) {
    console.error("Error generating AI challenges:", error);
    return [];
  }
}

export async function generateStudyPlan(profile: UserProfile): Promise<string> {
  const prompt = `
    You are an AI study coach for Moroccan students. 
    Generate a concise, motivating study plan (خطة دراسية) for a student with the following profile:
    - Grade: ${profile.grade || 'Baccalaureate'}
    - Type: ${profile.isRegional ? 'Regional (جهوي)' : 'Baccalaureate (باك)'}
    - Study Shift: ${profile.studyShift || 'General'}
    - Struggles: ${profile.struggles || 'General improvement'}
    - Favorite Subjects: ${profile.favoriteSubjects?.join(', ') || 'General'}
    - Subjects: ${profile.subjects?.join(', ') || 'General'}

    The plan should be in Arabic, formatted in Markdown, and provide actionable steps for daily/weekly study.
    Focus on overcoming their struggles and leveraging their favorite subjects.
    Keep it under 300 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "عذراً، لم نتمكن من توليد الخطة حالياً. حاول لاحقاً.";
  } catch (error) {
    console.error("Error generating AI study plan:", error);
    return "حدث خطأ أثناء توليد الخطة الدراسية.";
  }
}
