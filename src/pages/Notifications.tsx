import { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import axios from 'axios';
import { FaTrash, FaBell } from 'react-icons/fa';
import BeatLoader from 'react-spinners/BeatLoader';
import { showSuccessToast, showErrorToast } from '@/utils/ToastConfig';

interface Notification {
  notification_id: number;
  message_title: string;
  message_content: string;
  product_id: number;
  vendor_id: number;
  vendor_email: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useAppSelector((state) => state.signIn.user);
  const token = useAppSelector((state) => state.signIn.token);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_BASE_URL}/notification`;

      // Add role-specific endpoint
      if (user?.userType?.name === 'Vendor') {
        url += `/vendor/${user.id}`;
      } else if (user?.userType?.name === 'Admin') {
        url += '/admin'; // Admin gets all notifications
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.notification) {
        console.log('No notification data in response:', response.data);
        return;
      }

      setNotifications(response.data.notification);
    } catch (error: any) {
      console.error(
        'Error fetching notifications:',
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const endpoint = user?.userType?.name === 'Admin' ? 'admin' : 'vendor';
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/notification/${endpoint}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(notifications.filter((n) => n.notification_id !== id));
      showSuccessToast('Notification deleted successfully');
    } catch (error) {
      showErrorToast('Failed to delete notification');
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const endpoint = user?.userType?.name === 'Admin' ? 'admin' : 'vendor';
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/notification/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications([]);
      showSuccessToast('All notifications deleted successfully');
    } catch (error) {
      showErrorToast('Failed to delete all notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Update unread count whenever notifications change
    const count = notifications.filter(
      (notification) => !notification.isRead
    ).length;
    setUnreadCount(count);
  }, [notifications]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BeatLoader color="#6D31ED" size={10} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <FaBell className="text-2xl text-gray-800" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={deleteAllNotifications}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaTrash />
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <FaBell className="mx-auto text-gray-400 text-4xl mb-4" />
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.notification_id}
              className={`p-4 rounded-lg border ${
                notification.isRead
                  ? 'bg-white border-gray-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {notification.message_title}
                  </h3>
                  <p className="text-gray-800 whitespace-pre-line mt-2">
                    {notification.message_content}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() =>
                    deleteNotification(notification.notification_id)
                  }
                  className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
