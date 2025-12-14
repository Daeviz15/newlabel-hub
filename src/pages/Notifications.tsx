import { HomeHeader } from "@/components/home-header";
import { supabase } from "@/integrations/supabase/client";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  onClick: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  message,
  time,
  isRead,
  onClick,
}) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-[#1F1F1F] rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium font-Vietnam text-sm sm:text-base truncate">
          {title}
        </h3>
        <p className="text-[#EDEDED] text-xs font-Nunito sm:text-sm truncate">
          {message}
        </p>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <span className="text-gray-400 text-xs sm:text-sm">{time}</span>
        {!isRead && (
          <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

const Notifications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { userName, userEmail, avatarUrl } = useUserProfile();
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
  const router = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router("/login");
  };

  const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // Separate notifications into today and earlier
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayNotifications = notifications.filter(
    n => new Date(n.created_at) >= today
  );
  
  const earlierNotifications = notifications.filter(
    n => new Date(n.created_at) < today
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-brand-green text-black text-sm sm:text-base m-4 py-2 text-center font-medium rounded-md sm:hidden">
        <a href="/free-courses" className="hover:underline">
          Free Courses 🌟 Sale Ends Soon, Get It Now →
        </a>
      </div>

      <HomeHeader
        search={searchQuery}
        onSearchChange={setSearchQuery}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-2 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-vietnam leading-[150%] tracking-normal font-bold text-white">
            Notifications
          </h1>
          {notifications.some(n => !n.is_read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-lime-400 text-sm font-vietnam hover:text-lime-300 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="w-full h-[1px] bg-[#A3A3A3]/20 mt-12 mb-8"></div>

        {loading ? (
          <div className="text-center text-zinc-400 py-8">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-zinc-400 py-8">
            <p className="text-lg font-vietnam">No notifications yet</p>
            <p className="text-sm mt-2">You'll be notified when new content is added</p>
          </div>
        ) : (
          <>
            {/* Today Section */}
            {todayNotifications.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold font-Vietnam text-[24px] leading-[150%] tracking-normal text-white mb-3 sm:mb-4">
                  Today
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {todayNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      id={notification.id}
                      title={notification.title}
                      message={notification.message}
                      time={formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      isRead={notification.is_read}
                      onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Earlier Section */}
            {earlierNotifications.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white font-Vietnam mb-3 sm:mb-4">
                  Earlier
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {earlierNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      id={notification.id}
                      title={notification.title}
                      message={notification.message}
                      time={formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      isRead={notification.is_read}
                      onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;
