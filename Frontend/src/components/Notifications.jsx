import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Notifications = () => {
  const { backendUrl, utoken } = useContext(AppContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/notifications`,
        {},
        { headers: { utoken } },
      );
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/unread-count`,
        {},
        { headers: { utoken } },
      );
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `${backendUrl}/api/user/mark-notification-read`,
        { notificationId },
        { headers: { utoken } },
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAction = (notification) => {
    markAsRead(notification._id);
    switch (notification.type) {
      case "accepted":
        navigate("/my-appointments");
        break;
      case "rejected":
        navigate(`/appointments/${notification.docId}`);
        break;
      case "rescheduled":
        navigate("/my-appointments");
        break;
      case "completed":
        navigate("/my-appointments");
        break;
      default:
        break;
    }
    setShowDropdown(false);
  };

  const getActionButton = (type) => {
    switch (type) {
      case "accepted":
        return { text: "Pay Now", color: "bg-green-500" };
      case "rejected":
        return { text: "Book Again", color: "bg-blue-500" };
      case "rescheduled":
        return { text: "View / Cancel", color: "bg-yellow-500" };
      case "completed":
        return { text: "Leave Feedback", color: "bg-purple-500" };
      default:
        return { text: "View", color: "bg-gray-500" };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "accepted":
        return "✅";
      case "rejected":
        return "❌";
      case "rescheduled":
        return "🔄";
      case "completed":
        return "🎉";
      default:
        return "📩";
    }
  };

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    if (utoken) {
      fetchNotifications();
      fetchUnreadCount();

      // Poll every 30 seconds for new notifications
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [utoken]);

  if (!utoken) return null;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown) fetchNotifications();
        }}
        className="relative p-2 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[70vh] overflow-y-auto">
          <div className="p-3 border-b bg-gray-50 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-gray-500">
                {unreadCount} unread
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">
              No notifications yet
            </div>
          ) : (
            notifications.map((item) => {
              const action = getActionButton(item.type);
              return (
                <div
                  key={item._id}
                  className={`p-4 border-b hover:bg-gray-50 transition-all ${
                    !item.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-xl">{getTypeIcon(item.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{item.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {timeAgo(item.date)}
                        </span>
                        <button
                          onClick={() => handleAction(item)}
                          className={`px-3 py-1 text-xs text-white rounded ${action.color} hover:opacity-90 transition-all cursor-pointer`}
                        >
                          {action.text}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default Notifications;
