/**
 * Toast Notification Utility
 * Centralized toast notifications using react-hot-toast
 */

import toast from 'react-hot-toast';

export const showToast = {
  /**
   * Show success notification
   * @param {string} message - Success message
   * @param {number} duration - Duration in ms (default: 3000)
   */
  success: (message, duration = 3000) => {
    toast.success(message, {
      duration,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
      },
      icon: '✓',
    });
  },

  /**
   * Show error notification
   * @param {string} message - Error message
   * @param {number} duration - Duration in ms (default: 4000)
   */
  error: (message, duration = 4000) => {
    toast.error(message, {
      duration,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
      },
      icon: '✕',
    });
  },

  /**
   * Show info notification
   * @param {string} message - Info message
   * @param {number} duration - Duration in ms (default: 3000)
   */
  info: (message, duration = 3000) => {
    toast((t) => (
      <span style={{ color: '#fff' }}>{message}</span>
    ), {
      duration,
      position: 'top-right',
      style: {
        background: '#3b82f6',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      },
      icon: 'ℹ',
    });
  },

  /**
   * Show loading notification (can be updated)
   * @param {string} message - Loading message
   * @returns {string} Toast ID for updating
   */
  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6b7280',
        color: '#fff',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)',
      },
    });
  },

  /**
   * Update an existing toast
   * @param {string} toastId - Toast ID from loading()
   * @param {string} message - New message
   * @param {string} type - 'success', 'error', or 'info'
   */
  update: (toastId, message, type = 'success') => {
    const styles = {
      success: {
        background: '#10b981',
        icon: '✓',
      },
      error: {
        background: '#ef4444',
        icon: '✕',
      },
      info: {
        background: '#3b82f6',
        icon: 'ℹ',
      },
    };

    const style = styles[type] || styles.success;

    toast.success(message, {
      id: toastId,
      duration: 3000,
      position: 'top-right',
      style: {
        background: style.background,
        color: '#fff',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2)`,
      },
      icon: style.icon,
    });
  },
};
