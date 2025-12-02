import React from "react";

interface TabProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  tabs?: string[];
}

const Tab = ({ selectedTab, onTabChange, tabs = ["All", "For You", "Trending", "New Releases"] }: TabProps) => {
  return (
    <div className="bg-black rounded-lg flex gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
            selectedTab === tab
              ? "bg-lime-400 text-black"
              : "bg-neutral-800 text-white hover:bg-neutral-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tab;
