/**
 * Calculate age in years, months, and days from birth date
 * @param birthDate - Birth date string in YYYY-MM-DD format
 * @param assessmentDate - Assessment date (defaults to current date)
 * @returns Object with age_years, age_months, age_days
 */
export function calculateAge(
  birthDate: string,
  assessmentDate: Date = new Date()
): { age_years: number; age_months: number; age_days: number } {
  const birth = new Date(birthDate)
  
  let years = assessmentDate.getFullYear() - birth.getFullYear()
  let months = assessmentDate.getMonth() - birth.getMonth()
  let days = assessmentDate.getDate() - birth.getDate()

  // Adjust for negative days
  if (days < 0) {
    months--
    const prevMonth = new Date(assessmentDate.getFullYear(), assessmentDate.getMonth(), 0)
    days += prevMonth.getDate()
  }

  // Adjust for negative months
  if (months < 0) {
    years--
    months += 12
  }

  return {
    age_years: years,
    age_months: months,
    age_days: days,
  }
}
