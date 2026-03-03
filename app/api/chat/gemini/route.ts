import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini AI with API key from server-side environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Build context from history
    let contextPrompt = `Kamu adalah asisten AI yang membantu siswa belajar. Kamu ramah, sabar, dan memberikan penjelasan yang mudah dipahami. Jawab dalam Bahasa Indonesia.\n\n`;
    
    if (history && history.length > 0) {
      contextPrompt += 'Riwayat percakapan:\n';
      history.forEach((msg: Message) => {
        contextPrompt += `${msg.role === 'user' ? 'Siswa' : 'AI'}: ${msg.content}\n`;
      });
      contextPrompt += '\n';
    }

    contextPrompt += `Siswa: ${message}\nAI:`;

    // Generate content
    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error('Error in Gemini chat API:', error);
    
    // Handle specific error cases
    if (error?.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Maaf, terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
