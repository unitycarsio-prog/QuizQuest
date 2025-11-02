import { GoogleGenAI, Type } from '@google/genai';
import { Question } from '../types';
import { NUM_QUESTIONS } from '../constants';

// Fix: Aligned with the guidelines to initialize the client directly with the API key from the environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: 'The question text.'
      },
      options: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: 'An array of 4 possible answers.'
      },
      answer: {
        type: Type.STRING,
        description: 'The correct answer, which must be one of the options.'
      },
    },
    required: ['question', 'options', 'answer'],
  },
};


export const generateQuizQuestions = async (grade: string, subject: string): Promise<Question[]> => {
  try {
    const prompt = `You are an expert quiz creator for students. Generate ${NUM_QUESTIONS} multiple-choice questions for a student in '${grade}' on the subject of '${subject}'.
Each question must have exactly 4 options and a single correct answer from the options.
Ensure the questions are challenging but appropriate for the specified grade level.
Return the questions in a valid JSON array format. Do not include any text, markdown, or explanation outside of the JSON array.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: quizSchema,
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 0 },
      }
    });

    const jsonText = response.text.trim();
    const questions = JSON.parse(jsonText);
    
    // Validate the response structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("AI returned an invalid or empty list of questions.");
    }
    
    // Further validation to ensure questions have the correct format
    return questions.filter(q => 
        q.question && Array.isArray(q.options) && q.options.length === 4 && q.answer && q.options.includes(q.answer)
    );

  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz from AI. Please try again.");
  }
};