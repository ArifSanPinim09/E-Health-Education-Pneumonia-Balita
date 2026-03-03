/**
 * Calculate test score by comparing user answers with correct answers
 * @param userAnswers - Array of boolean answers from the user
 * @param correctAnswers - Array of correct boolean answers
 * @returns Score (number of correct answers)
 */
export function calculateScore(
  userAnswers: boolean[],
  correctAnswers: boolean[]
): number {
  if (userAnswers.length !== correctAnswers.length) {
    throw new Error('Answer arrays must have the same length')
  }

  let score = 0
  for (let i = 0; i < userAnswers.length; i++) {
    if (userAnswers[i] === correctAnswers[i]) {
      score++
    }
  }

  return score
}

/**
 * Validate that answers array is properly formatted
 * @param answers - Array to validate
 * @returns Object with isValid flag and error message if invalid
 */
export function validateAnswers(answers: any): {
  isValid: boolean
  error?: string
} {
  if (!Array.isArray(answers)) {
    return {
      isValid: false,
      error: 'Format jawaban tidak valid',
    }
  }

  if (answers.length !== 23) {
    return {
      isValid: false,
      error: 'Jumlah jawaban harus 23 pertanyaan',
    }
  }

  if (!answers.every(answer => typeof answer === 'boolean')) {
    return {
      isValid: false,
      error: 'Semua jawaban harus berupa true atau false',
    }
  }

  return { isValid: true }
}

/**
 * Calculate percentage score
 * @param score - Number of correct answers
 * @param total - Total number of questions
 * @returns Percentage (0-100)
 */
export function calculatePercentage(score: number, total: number): number {
  if (total === 0) {
    return 0
  }
  return Math.round((score / total) * 100)
}
