/**
 * Format date to Indonesian format (DD/MM/YYYY)
 * @param date - Date object or date string
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDateIndonesian(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Format date to Indonesian long format (e.g., "15 Januari 2024")
 * @param date - Date object or date string
 * @returns Formatted date string in Indonesian long format
 */
export function formatDateIndonesianLong(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  
  return `${day} ${month} ${year}`;
}

/**
 * Format date and time to Indonesian format (DD/MM/YYYY HH:MM)
 * @param date - Date object or date string
 * @returns Formatted date and time string
 */
export function formatDateTimeIndonesian(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Parse Indonesian date format (DD/MM/YYYY) to Date object
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns Date object
 */
export function parseIndonesianDate(dateString: string): Date {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format number with Indonesian decimal separator (comma)
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export function formatNumberIndonesian(num: number, decimals: number = 0): string {
  return num.toFixed(decimals).replace('.', ',');
}

/**
 * Format number with thousands separator (dot) and decimal separator (comma)
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string (e.g., 1.234.567,89)
 */
export function formatNumberIndonesianFull(num: number, decimals: number = 0): string {
  const parts = num.toFixed(decimals).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decimalPart = parts[1] || '';
  
  if (decimals > 0 && decimalPart) {
    return `${integerPart},${decimalPart}`;
  }
  
  return integerPart;
}

/**
 * Format percentage with Indonesian decimal separator
 * @param num - Number to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "85,5%")
 */
export function formatPercentageIndonesian(num: number, decimals: number = 1): string {
  return `${formatNumberIndonesian(num, decimals)}%`;
}

/**
 * Format score display (e.g., "18 dari 23")
 * @param score - Current score
 * @param total - Total possible score
 * @returns Formatted score string
 */
export function formatScore(score: number, total: number): string {
  return `${score} dari ${total}`;
}

/**
 * Format time duration in Indonesian (e.g., "2 jam 30 menit")
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted duration string
 */
export function formatDurationIndonesian(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0 && minutes > 0) {
    return `${hours} jam ${minutes} menit`;
  } else if (hours > 0) {
    return `${hours} jam`;
  } else if (minutes > 0) {
    return `${minutes} menit`;
  } else {
    return 'kurang dari 1 menit';
  }
}

/**
 * Format relative time in Indonesian (e.g., "2 hari yang lalu")
 * @param date - Date object or date string
 * @returns Formatted relative time string
 */
export function formatRelativeTimeIndonesian(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} hari yang lalu`;
  } else if (diffHours > 0) {
    return `${diffHours} jam yang lalu`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} menit yang lalu`;
  } else {
    return 'baru saja';
  }
}
