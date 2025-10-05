import { HomeHeader } from "@/components/home-header";
import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";



interface NotificationItemProps {
  title: string;
  subtitle: string;
  time: string;
  hasGreenDot?: boolean;
  avatar: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ title, subtitle, time, hasGreenDot, avatar }) => {
  return (
    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-[#1F1F1F] rounded-lg hover:bg-gray-700 transition-colors">
      <img
        src={avatar || "/placeholder.svg"}
        alt="User avatar"
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium font-Vietnam fonttext-sm sm:text-base truncate">{title}</h3>
        <p className="text-[#EDEDED] w-[377px] h-[27px] text-xs font-Nunito sm:text-sm truncate">{subtitle}</p>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <span className="text-gray-400 text-xs sm:text-sm">{time}</span>
        {hasGreenDot && <div className="w-2 h-2 bg-lime-400 rounded-full"></div>}
      </div>
    </div>
  );
};

const Notifications: React.FC = () => {
  const notifications: NotificationItemProps[] = [
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

  const earlierNotifications: NotificationItemProps[] = [
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

  // Add missing state for searchQuery
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy user data and sign out handler for HomeHeader
  const userName = "Guest";
  const userEmail = "guest@example.com";
  const avatarUrl = "";
  const handleSignOut = () => {
    // Implement sign out logic here
    console.log("Sign out clicked");
  };

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
          <h1 className="text-2xl sm:text-3xl  font-vietnam leading-[150%] tracking-normal font-bold text-white">Notifications</h1>
          <p className="text-[#EDEDED] text-sm sm:text-basefont-Be font-[semi-bold] font-vietnam leading-[150%] tracking-normal  ">
            Find all your saved, purchased and in-progress content here
          </p>
        </div>
        {/* Today Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold font-Vietnam  font-[24px] leading-[150%] tracking-normaltext-white mb-3 sm:mb-4">Today</h2>
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
          <h2 className="text-lg sm:text-xl font-semibold text-white font-Vietnam mb-3 sm:mb-4">Earlier</h2>
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
      <Footer />
    </div>
  );
};

export default Notifications;
