'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Simulated notifications data
      const mockNotifications = [
        {
          id: 1,
          type: 'appointment',
          title: 'New Appointment Booked',
          message: 'John Doe has booked an appointment for tomorrow at 10:00 AM',
          time: '5 minutes ago',
          read: false,
          icon: '📅',
        },
        {
          id: 2,
          type: 'payment',
          title: 'Payment Received',
          message: 'Payment of $150 received from Patient #4532',
          time: '1 hour ago',
          read: false,
          icon: '💰',
        },
        {
          id: 3,
          type: 'reminder',
          title: 'Upcoming Appointment',
          message: 'You have 3 appointments scheduled for today',
          time: '2 hours ago',
          read: true,
          icon: '⏰',
        },
        {
          id: 4,
          type: 'system',
          title: 'System Update',
          message: 'A new version of the system is available',
          time: '1 day ago',
          read: true,
          icon: '🔔',
        },
        {
          id: 5,
          type: 'message',
          title: 'New Message',
          message: 'Dr. Smith sent you a message regarding patient consultation',
          time: '2 days ago',
          read: true,
          icon: '💬',
        },
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 rounded-3xl p-8 shadow-2xl">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-6 shadow-lg shadow-emerald-500/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
                  <p className="text-white/90">
                    {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                  </p>
                </div>
                
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Mark All as Read
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-md">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'all' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'unread' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'read' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No Notifications</h3>
                  <p className="text-slate-500">
                    {filter === 'unread' ? 'You have no unread notifications' : 
                     filter === 'read' ? 'You have no read notifications' : 
                     'You have no notifications yet'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                    className={`bg-white rounded-xl shadow-md p-5 border-2 transition-all cursor-pointer hover:scale-[1.02] ${
                      !notification.read 
                        ? 'border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/20' 
                        : 'border-slate-200 hover:shadow-lg'
                    }`}
                    style={{
                      animation: 'slideUp 0.3s ease-out',
                      animationDelay: `${index * 0.05}s`,
                      animationFillMode: 'backwards'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                        !notification.read 
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/30' 
                          : 'bg-slate-100'
                      }`}>
                        {notification.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-semibold ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            )}
                          </h3>
                          <span className="text-xs text-slate-500 whitespace-nowrap">{notification.time}</span>
                        </div>
                        <p className={`text-sm ${!notification.read ? 'text-slate-700' : 'text-slate-500'} mb-3`}>
                          {notification.message}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200 transition-colors"
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
