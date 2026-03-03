import { createAdminClient } from '../lib/supabase/admin'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

/**
 * Seed script to insert 23 quiz questions about pneumonia balita
 * Run with: npx tsx scripts/seed-quiz-questions.ts
 */

const quizQuestions = [
  {
    question_text: 'Pneumonia adalah infeksi yang menyerang paru-paru.',
    correct_answer: true,
    order_number: 1,
  },
  {
    question_text: 'Pneumonia hanya bisa menyerang orang dewasa.',
    correct_answer: false,
    order_number: 2,
  },
  {
    question_text: 'Balita lebih rentan terkena pneumonia dibandingkan orang dewasa.',
    correct_answer: true,
    order_number: 3,
  },
  {
    question_text: 'Pneumonia dapat disebabkan oleh virus, bakteri, atau jamur.',
    correct_answer: true,
    order_number: 4,
  },
  {
    question_text: 'Batuk dan demam adalah gejala umum pneumonia pada balita.',
    correct_answer: true,
    order_number: 5,
  },
  {
    question_text: 'Napas cepat bukan merupakan tanda pneumonia pada balita.',
    correct_answer: false,
    order_number: 6,
  },
  {
    question_text: 'Retraksi dinding dada adalah salah satu tanda bahaya pneumonia.',
    correct_answer: true,
    order_number: 7,
  },
  {
    question_text: 'Balita dengan pneumonia tidak perlu dibawa ke dokter jika masih bisa makan.',
    correct_answer: false,
    order_number: 8,
  },
  {
    question_text: 'Suhu tubuh normal balita adalah 36,5-37,5°C.',
    correct_answer: true,
    order_number: 9,
  },
  {
    question_text: 'Menghitung napas balita harus dilakukan saat anak sedang menangis.',
    correct_answer: false,
    order_number: 10,
  },
  {
    question_text: 'Frekuensi napas normal balita usia 2-12 bulan adalah kurang dari 50 kali per menit.',
    correct_answer: true,
    order_number: 11,
  },
  {
    question_text: 'Frekuensi napas normal balita usia 1-5 tahun adalah kurang dari 40 kali per menit.',
    correct_answer: true,
    order_number: 12,
  },
  {
    question_text: 'Antibiotik tidak diperlukan untuk mengobati pneumonia yang disebabkan oleh bakteri.',
    correct_answer: false,
    order_number: 13,
  },
  {
    question_text: 'Nebulizer dapat membantu melegakan pernapasan balita dengan pneumonia.',
    correct_answer: true,
    order_number: 14,
  },
  {
    question_text: 'Komplikasi pneumonia dapat menyebabkan kematian pada balita.',
    correct_answer: true,
    order_number: 15,
  },
  {
    question_text: 'Dehidrasi bukan merupakan komplikasi dari pneumonia.',
    correct_answer: false,
    order_number: 16,
  },
  {
    question_text: 'Memberikan ASI eksklusif dapat membantu mencegah pneumonia pada bayi.',
    correct_answer: true,
    order_number: 17,
  },
  {
    question_text: 'Imunisasi tidak berperan dalam pencegahan pneumonia.',
    correct_answer: false,
    order_number: 18,
  },
  {
    question_text: 'Tepid sponge dapat membantu menurunkan demam pada balita.',
    correct_answer: true,
    order_number: 19,
  },
  {
    question_text: 'Fisioterapi dada dapat membantu mengeluarkan dahak pada balita dengan pneumonia.',
    correct_answer: true,
    order_number: 20,
  },
  {
    question_text: 'Balita dengan pneumonia harus selalu berbaring dan tidak boleh bergerak.',
    correct_answer: false,
    order_number: 21,
  },
  {
    question_text: 'Saturasi oksigen normal adalah 95% atau lebih.',
    correct_answer: true,
    order_number: 22,
  },
  {
    question_text: 'Pneumonia tidak menular dari satu anak ke anak lainnya.',
    correct_answer: false,
    order_number: 23,
  },
]

async function seedQuizQuestions() {
  console.log('🌱 Starting quiz questions seeding...')

  try {
    const supabase = createAdminClient()

    // Check if questions already exist
    const { data: existingQuestions, error: checkError } = await supabase
      .from('quiz_questions')
      .select('id')
      .limit(1)

    if (checkError) {
      throw checkError
    }

    if (existingQuestions && existingQuestions.length > 0) {
      console.log('⚠️  Quiz questions already exist. Skipping seed.')
      console.log('   To re-seed, delete existing questions first.')
      return
    }

    // Insert all questions
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert(quizQuestions as any)
      .select()

    if (error) {
      throw error
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} quiz questions`)
    console.log('   Questions are ready for use in pre-test and post-test')
  } catch (error) {
    console.error('❌ Error seeding quiz questions:', error)
    process.exit(1)
  }
}

// Run the seed function
seedQuizQuestions()
  .then(() => {
    console.log('🎉 Seeding completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
