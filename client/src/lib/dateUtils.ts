import { format as dateFnsFormat } from 'date-fns';

/**
 * Format a date in a language-neutral numeric format
 * @param date - Date to format (Date object, timestamp, or Firestore timestamp)
 * @param formatType - 'short' (dd.MM.yyyy) or 'long' (dd.MM.yyyy HH:mm)
 * @returns Formatted date string
 */
export function formatDate(date: Date | number | any, formatType: 'short' | 'long' = 'short'): string {
    try {
        let dateObj: Date;

        // Handle Firestore Timestamp (has _seconds property)
        if (typeof date === 'object' && date !== null && '_seconds' in date) {
            dateObj = new Date(date._seconds * 1000);
        }
        // Handle Unix timestamp (number)
        else if (typeof date === 'number') {
            dateObj = new Date(date);
        }
        // Handle Date object or ISO string
        else {
            dateObj = new Date(date);
        }

        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            return '';
        }

        // Use numeric format that works in all languages
        if (formatType === 'long') {
            return dateFnsFormat(dateObj, 'dd.MM.yyyy HH:mm');
        }
        return dateFnsFormat(dateObj, 'dd.MM.yyyy');
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
}

/**
 * Format a date for display in lists (compact format)
 * @param date - Date to format
 * @returns Formatted date string (e.g., "23.11.2025")
 */
export function formatDateShort(date: Date | number | any): string {
    return formatDate(date, 'short');
}

/**
 * Format a date with time for detailed views
 * @param date - Date to format
 * @returns Formatted date string (e.g., "23.11.2025 14:30")
 */
export function formatDateTime(date: Date | number | any): string {
    return formatDate(date, 'long');
}
