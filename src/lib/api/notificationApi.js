// Notification API functions

/**
 * Fetch all notifications for the current user
 * @param {Object} options - Query options
 * @param {boolean} options.unreadOnly - Fetch only unread notifications
 * @param {number} options.limit - Maximum number of notifications to fetch
 * @returns {Promise<Array>} Array of notifications
 */
export async function fetchNotifications({ unreadOnly = false, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (unreadOnly) params.append('unreadOnly', 'true');
  if (limit) params.append('limit', limit.toString());

  const response = await fetch(`/api/notifications?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return response.json();
}

/**
 * Mark a notification as read
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export async function markNotificationAsRead(id) {
  const response = await fetch(`/api/notifications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ read: true }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
  return response.json();
}

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Response message
 */
export async function markAllNotificationsAsRead() {
  const response = await fetch('/api/notifications', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark all notifications as read');
  }
  return response.json();
}

/**
 * Delete a notification
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Response message
 */
export async function deleteNotification(id) {
  const response = await fetch(`/api/notifications/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete notification');
  }
  return response.json();
}

/**
 * Create a new notification
 * @param {Object} data - Notification data
 * @returns {Promise<Object>} Created notification
 */
export async function createNotification(data) {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create notification');
  }
  return response.json();
}

/**
 * Get unread notification count
 * @returns {Promise<number>} Count of unread notifications
 */
export async function getUnreadNotificationCount() {
  const notifications = await fetchNotifications({ unreadOnly: true });
  return notifications.length;
}
