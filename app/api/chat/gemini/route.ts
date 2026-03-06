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
      model: 'gemini-pro',
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
    let contextPrompt = `Kamu adalah asisten AI edukasi pneumonia balita yang membantu ibu-ibu memahami tentang pneumonia pada anak balita. 

Peranmu:
- Memberikan informasi akurat tentang pneumonia balita
- Menjelaskan gejala, pencegahan, dan penanganan pneumonia
- Menggunakan bahasa yang mudah dipahami oleh ibu-ibu
- Ramah, sabar, dan suportif
- Selalu menekankan pentingnya konsultasi ke dokter untuk diagnosis dan pengobatan

Topik yang kamu kuasai:
- Definisi dan penyebab pneumonia
- Gejala dan tanda bahaya pneumonia
- Cara pencegahan (imunisasi, ASI eksklusif, nutrisi, kebersihan)
- Kapan harus ke dokter
- Komplikasi pneumonia
- Perawatan di rumah

Jawab dalam Bahasa Indonesia dengan bahasa yang hangat dan mudah dipahami.

`;
    
    if (history && history.length > 0) {
      contextPrompt += 'Riwayat percakapan:\n';
      history.forEach((msg: Message) => {
        contextPrompt += `${msg.role === 'user' ? 'Ibu' : 'Asisten'}: ${msg.content}\n`;
      });
      contextPrompt += '\n';
    }

    contextPrompt += `Ibu: ${message}\nAsisten:`;

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
