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
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800, // Balanced for complete but concise responses
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

ATURAN PENTING DALAM MENJAWAB:
1. Jawab dengan LENGKAP tapi RINGKAS (3-5 paragraf pendek, masing-masing 2-3 kalimat)
2. SELALU selesaikan jawaban dengan kalimat penutup yang lengkap
3. Gunakan bahasa yang SEDERHANA dan MUDAH dipahami
4. Gunakan poin-poin hanya jika benar-benar diperlukan (maksimal 4-5 poin)
5. Fokus pada informasi PALING PENTING dan PRAKTIS
6. Gunakan nada yang hangat dan ramah seperti berbicara langsung
7. WAJIB akhiri dengan kalimat penutup yang mendorong konsultasi ke dokter jika perlu

GAYA BAHASA:
- Sapaan: "Bu" atau "Ibu"
- Nada: Hangat, ramah, seperti teman yang peduli
- Kalimat: Pendek dan mudah dipahami
- Hindari: Istilah medis yang rumit, penjelasan terlalu detail

TOPIK YANG DIKUASAI:
- Definisi pneumonia (singkat)
- Gejala utama (3-4 gejala penting saja)
- Pencegahan (imunisasi, ASI, kebersihan, hindari asap rokok)
- Kapan harus ke dokter (tanda bahaya)
- Perawatan dasar di rumah

CONTOH JAWABAN YANG BAIK:
"Pneumonia adalah infeksi paru-paru yang bisa berbahaya untuk balita, Bu. Gejalanya biasanya batuk berdahak, demam tinggi, napas cepat, dan anak terlihat lemas.

Untuk mencegahnya, pastikan imunisasi lengkap (terutama PCV dan Hib), berikan ASI eksklusif, jaga kebersihan dengan cuci tangan rutin, dan hindari asap rokok. Nutrisi yang baik juga penting untuk daya tahan tubuh si kecil.

Jika anak mengalami gejala tersebut, segera bawa ke dokter ya Bu untuk pemeriksaan dan penanganan yang tepat."

PENTING: Pastikan jawaban SELALU LENGKAP dan SELESAI dengan baik, jangan terpotong di tengah kalimat.

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
