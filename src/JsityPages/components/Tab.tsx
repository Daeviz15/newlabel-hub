import { TabsList } from "@radix-ui/react-tabs";
import React, { useState } from "react";

const Tab = () => {
  const [selectedTab, isSelectedTab] = useState("For You");
  const TabList = ["Home", "Courses", "About Us", "Contact"];

  return (
      <div className="bg-black rounded-lg flex gap-2">
        {TabList.map((tab) => (
          <button
            key={tab}
            onClick={() => isSelectedTab(tab)}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              selectedTab === tab
                ? "bg-[#A136FF] text-black"
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
