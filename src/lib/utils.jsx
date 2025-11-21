import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a date string or Date object to a readable date format
 * @param {string|Date} date - The date to format
 * @param {string} formatStr - Optional custom format string (default: 'dd MMM yyyy')
 * @returns {string} Formatted date string
 */
export function formatDate(date, formatStr = 'dd MMM yyyy') {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Format a date string or Date object to a time format
 * @param {string|Date} date - The date/time to format
 * @param {string} formatStr - Optional custom format string (default: 'HH:mm')
 * @returns {string} Formatted time string
 */
export function formatTime(date, formatStr = 'HH:mm') {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Time';
  }
}

/**
 * Format a date string or Date object to a full date-time format
 * @param {string|Date} date - The date/time to format
 * @param {string} formatStr - Optional custom format string (default: 'dd MMM yyyy, HH:mm')
 * @returns {string} Formatted date-time string
 */
export function formatDateTime(date, formatStr = 'dd MMM yyyy, HH:mm') {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: fr });
  } catch (error) {
    console.error('Error formatting date-time:', error);
    return 'Invalid Date';
  }
}

/**
 * Format a date for input fields (YYYY-MM-DD format)
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string for input
 */
export function formatDateForInput(date) {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
}

/**
 * Format a time for input fields (HH:mm format)
 * @param {string|Date} date - The date/time to format
 * @returns {string} Formatted time string for input
 */
export function formatTimeForInput(date) {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time for input:', error);
    return '';
  }
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} date - The date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffInMs = dateObj - now;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);
    
    if (Math.abs(diffInMinutes) < 1) return 'Maintenant';
    if (Math.abs(diffInMinutes) < 60) {
      return diffInMinutes > 0 
        ? `Dans ${diffInMinutes} min` 
        : `Il y a ${Math.abs(diffInMinutes)} min`;
    }
    if (Math.abs(diffInHours) < 24) {
      return diffInHours > 0 
        ? `Dans ${diffInHours}h` 
        : `Il y a ${Math.abs(diffInHours)}h`;
    }
    return diffInDays > 0 
      ? `Dans ${diffInDays}j` 
      : `Il y a ${Math.abs(diffInDays)}j`;
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'N/A';
  }
}

/**
 * Combine separate date and time values into an ISO string
 * @param {string} dateValue - Date in YYYY-MM-DD format
 * @param {string} timeValue - Time in HH:mm format
 * @returns {string} ISO date-time string
 */
export function combineDateAndTime(dateValue, timeValue) {
  if (!dateValue || !timeValue) return null;
  
  try {
    const dateTimeString = `${dateValue}T${timeValue}:00`;
    return new Date(dateTimeString).toISOString();
  } catch (error) {
    console.error('Error combining date and time:', error);
    return null;
  }
}

/**
 * Check if a date is in the past
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if date is in the past
 */
export function isPast(date) {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj < new Date();
  } catch (error) {
    console.error('Error checking if date is past:', error);
    return false;
  }
}

/**
 * Check if a date is today
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
}
