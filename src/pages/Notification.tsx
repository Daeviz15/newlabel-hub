import React from 'react';

interface NotificationItemProps {
  title: string;
  subtitle: string;
  time: string;
  hasGreenDot?: boolean;
  avatar: string;
}

function NotificationItem({ title, subtitle, time, hasGreenDot, avatar }: NotificationItemProps) {
  return (
    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
      <img
        src={avatar || "/placeholder.svg"}
        alt="User avatar"
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium text-sm sm:text-base truncate">{title}</h3>
        <p className="text-gray-400 text-xs sm:text-sm truncate">{subtitle}</p>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <span className="text-gray-400 text-xs sm:text-sm">{time}</span>
        {hasGreenDot && <div className="w-2 h-2 bg-lime-400 rounded-full"></div>}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const notifications = [
    {
      title: "New episode released: The House Chronicles",
      subtitle: "Your K-Drama Bestie - Ep. 12",
      time: "2h ago",
      hasGreenDot: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    },
    {
      title: "New episode released: The House Chronicles",
      subtitle: "Your K-Drama Bestie - Ep. 12",
      time: "2h ago",
      hasGreenDot: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    },
    {
      title: "New episode released: The House Chronicles",
      subtitle: "Your K-Drama Bestie - Ep. 12",
      time: "2h ago",
      hasGreenDot: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    },
    {
      title: "New episode released: The House Chronicles",
      subtitle: "Your K-Drama Bestie - Ep. 12",
      time: "2h ago",
      hasGreenDot: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    },
  ];

  const earlierNotifications = [
    {
      title: "New episode released: The House Chronicles",
      subtitle: "Your K-Drama Bestie - Ep. 12",
      time: "2h ago",
      hasGreenDot: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    },
    {
      title: "New episode released: The House Chronicles",
      subtitle: "Your K-Drama Bestie - Ep. 12",
      time: "2h ago",
      hasGreenDot: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
    },
    {
      title: "New episode released: The House Chronicles",
      subtitle: "Your K-Drama Bestie - Ep. 12",
      time: "2h ago",
      hasGreenDot: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
    },
    {
      title: "New episode released: The House Chronicles",
      subtitle: "Your K-Drama Bestie - Ep. 12",
      time: "2h ago",
      hasGreenDot: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8",
    },
    {
      title: "New episode released: The House Chronicles",
      subtitle: "Your K-Drama Bestie - Ep. 12",
      time: "2h ago",
      hasGreenDot: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=9",
    },
    {
      title: "New episode released: The House Chronicles",
      subtitle: "Your K-Drama Bestie - Ep. 12",
      time: "2h ago",
      hasGreenDot: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=10",
    },
    {
      title: "New episode released: The House Chronicles",
      subtitle: "Your K-Drama Bestie - Ep. 12",
      time: "2h ago",
      hasGreenDot: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=11",
    },
    {
      title: "New episode released: The House Chronicles",
      subtitle: "Your K-Drama Bestie - Ep. 12",
      time: "2h ago",
      hasGreenDot: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=12",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-2 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Find all your saved, purchased and in-progress content here
          </p>
        </div>

        {/* Today Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Today</h2>
          <div className="space-y-2 sm:space-y-3">
            {notifications.map((notification, index) => (
              <NotificationItem
                key={`today-${index}`}
                title={notification.title}
                subtitle={notification.subtitle}
                time={notification.time}
                hasGreenDot={notification.hasGreenDot}
                avatar={notification.avatar}
              />
            ))}
          </div>
        </div>

        {/* Earlier Section */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Earlier</h2>
          <div className="space-y-2 sm:space-y-3">
            {earlierNotifications.map((notification, index) => (
              <NotificationItem
                key={`earlier-${index}`}
                title={notification.title}
                subtitle={notification.subtitle}
                time={notification.time}
                hasGreenDot={notification.hasGreenDot}
                avatar={notification.avatar}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
