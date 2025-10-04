import { TabsList } from "@radix-ui/react-tabs";
import React, { useState } from "react";

const Tab = () => {
  const [selectedTab, isSelectedTab] = useState("For You");
  const TabList = ["All", "For You", "Trending", "New Releases"];

  return (
      <div className="bg-black rounded-lg flex gap-2">
        {TabList.map((tab) => (
          <button
            key={tab}
            onClick={() => isSelectedTab(tab)}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
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
