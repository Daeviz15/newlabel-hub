import React, { useState } from "react";
import { ResumeCard, ProductCard } from "@/components/course-card";
import { HomeHeader } from "../components/home-header";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/use-user-profile";

export default function MyLibrary() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const { userName, userEmail, avatarUrl } = useUserProfile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  

  const courses = [
    {
      image: "/assets/dashboard-images/face.jpg",
      title: "The Future Of AI In Everyday Products",
      creator: "Jsify",
      creatorLogo: "/jsify-logo.jpg",
      price: "$18",
    },
    {
      image: "/assets/dashboard-images/firm.jpg",
      title: "Firm Foundation",
      creator: "",
      creatorLogo: "/star-icon.png",
      price: "$18",
    },
    {
      image: "/assets/dashboard-images/lady.jpg",
      title: "The Silent Trauma Of Millenials",
      creator: "The House Chronicles",
      price: "$18",
    },
    {
      image: "/assets/dashboard-images/face.jpg",
      title: "The Future Of AI In Everyday Products",
      creator: "Jsify",
      creatorLogo: "/jsify-logo.jpg",
      price: "$18",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-brand-green text-black text-sm sm:text-base m-4 py-2 text-center font-medium rounded-md sm:hidden">
          <a href="/free-courses" className="hover:underline">
            Free Courses 🌟 Sale Ends Soon, Get It Now →
          </a>
        </div>
      <HomeHeader
        search=""
        onSearchChange={() => {}}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-vietnam font-bold mb-2 leading-[150%] tracking-normal">My Library</h1>
          <p className="text-[#EDEDED] text-xs sm:text-sm font-normal font-vietnam leading-[150%] tracking-normal">Find all of your saved, purchased and in-progress content here</p>
        </div>
        <div className="w-full h-[1px] bg-[#A3A3A3]/20 mt-6 sm:mt-12 mb-6 sm:mb-8"></div>


        {/* Tabs */}
  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
            className={
              activeTab === "all"
                ? "bg-[#70E002] text-black hover:bg-lime-500 font-Nunito"
                : "bg-[#262626] border-[#262626] text-white hover:bg-gray-800"
            }
          >
            All
          </Button>
          <Button
            variant={activeTab === "continue-watching" ? "default" : "outline"}
            onClick={() => setActiveTab("continue-watching")}
            className={
              activeTab === "continue-watching"
                ? "bg-[#70E002] text-black hover:bg-[#262626] font-Nunito"
                : "bg-[#262626] border-[#262626] text-white hover:[#262626]"
            }
          >
            Continue Watching
          </Button>
          <Button
            variant={activeTab === "saved" ? "default" : "outline"}
            onClick={() => setActiveTab("saved")}
            className={
              activeTab === "saved"
                ? "bg-[#70E002] text-black hover:bg-gray-700 font-Nunito"
                : "bg-[#262626] border-[#262626] text-white hover:bg-gray-800"
            }
          >
            Saved
          </Button>
          <Button
            variant={activeTab === "downloads" ? "default" : "outline"}
            onClick={() => setActiveTab("downloads")}
            className={
              activeTab === "downloads"
                ? "bg-[#70E002] text-black hover:bg-gray-700 font-Nunito"
                : "bg-[#262626] border-[#262626] text-white hover:bg-gray-800"
            }
          >
            Downloads
          </Button>
        </div>

        {/* Continue Watching */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-[#EDEDED] text-xl sm:text-2xl font-bold mb-2 font-Nunito">Continue Watching</h2>
          <p className="text-[#EDEDED] mb-4 sm:mb-6 text-sm sm:text-base font-Inter font-normal leading-[120%]">Learn binge-worthy, career-building lessons from experts across tech media and business.</p>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {courses.map((course, index) => (
              <ResumeCard
                key={`continue-${index}`}
                imageSrc={course.image}
                title={course.title}
                percent={72}
                brand={course.creator}
              />
            ))}
          </div>
        </section>

        {/* Saved For Later */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-[#EDEDED] text-xl sm:text-2xl font-bold mb-2 font-Inter">Saved For Later</h2>
          <p className="text-[#EDEDED] mb-4 sm:mb-6 text-sm sm:text-base font-normal leading-[120%]">Learn binge-worthy, career-building lessons from experts across tech media and business.</p>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {courses.map((course, index) => (
              <ProductCard key={`saved-${index}`} imageSrc={course.image} {...course} />
            ))}
          </div>
        </section>

        {/* Purchased */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-[#EDEDED] text-xl sm:text-2xl font-bold mb-2 font-Inter font-Nunito">Purchased</h2>
          <p className="text-[#EDEDED] mb-4 sm:mb-6 text-sm sm:text-base font-normal leading-[120%]">Learn binge-worthy, career-building lessons from experts across tech media and business.</p>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {courses.map((course, index) => (
              <ProductCard key={`purchased-${index}`} imageSrc={course.image} {...course} />
            ))}
          </div>
        </section>

        {/* Downloads */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-[#EDEDED] text-xl sm:text-2xl font-bold mb-2 Font-Inter font-Nunito">Downloads</h2>
          <p className="text-[#EDEDED] mb-4 sm:mb-6 text-sm sm:text-base font-normal leading-[120%]">Learn binge-worthy, career-building lessons from experts across tech media and business.</p>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {courses.map((course, index) => (
              <ProductCard key={`downloads-${index}`} imageSrc={course.image} {...course} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}



