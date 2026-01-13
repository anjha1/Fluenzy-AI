import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { question, answer, module, context } = await request.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const prompt = `
Evaluate the following answer in the context of a ${module} session.

Question: ${question}
Answer: ${answer}
Context: ${context || 'General interview/practice session'}

Provide evaluation in JSON format:
{
  "idealAnswer": "A professionally written ideal response",
  "aiFeedback": "Brief feedback on the answer",
  "scores": {
    "clarity": 0-10,
    "relevance": 0-10,
    "grammar": 0-10,
    "confidence": 0-10,
    "technicalAccuracy": 0-10
  },
  "perQuestionScore": 0-10
}

Be constructive and provide actionable feedback.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const evaluation = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json({ error: 'Failed to evaluate answer' }, { status: 500 });
  }
}