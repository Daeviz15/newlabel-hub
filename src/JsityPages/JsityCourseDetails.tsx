import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { JHomeHeader } from "./components/home-header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Play, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";

interface CourseData {
  id: string;
  image: string;
  title: string;
  creator: string;
  price: string;
  lessons?: number;
  instructor?: string;
  role?: string;
}

interface LessonItem {
  number: string;
  title: string;
  duration: string;
  isNew?: boolean;
}

export default function JsityCourseDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const courseData = location.state as CourseData;
  const { userName, userEmail, avatarUrl } = useUserProfile();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Course curriculum data
  const curriculum = [
    {
      section: "01",
      title: "Introduction to UI/UX Design",
      lessons: [
        { number: "01", title: "Understanding UI/UX Design Principles", duration: "45 Minutes" },
        { number: "02", title: "Importance of User-Centered Design", duration: "1 Hour", isNew: true },
        { number: "03", title: "The Role of UI/UX Design in Product Development", duration: "45 Minutes" },
      ],
    },
    {
      section: "02",
      title: "User Research and Analysis",
      lessons: [
        { number: "01", title: "Conducting User Research and Interviews", duration: "1 Hour" },
        { number: "02", title: "Analyzing User Needs and Behavior", duration: "1 Hour" },
        { number: "03", title: "Creating User Personas and Scenarios", duration: "45 Minutes" },
      ],
    },
    {
      section: "03",
      title: "Wireframing and Prototyping",
      lessons: [
        { number: "01", title: "Introduction to Wireframing Tools and Techniques", duration: "1 Hour" },
        { number: "02", title: "Creating Low-Fidelity Wireframes", duration: "1 Hour" },
        { number: "03", title: "Prototyping and Interactive Mockups", duration: "1 Hour" },
      ],
    },
    {
      section: "04",
      title: "Visual Design and Branding",
      lessons: [
        { number: "01", title: "Color Theory and Typography in UI Design", duration: "1 Hour" },
        { number: "02", title: "Visual Hierarchy and Layout Design", duration: "1 Hour" },
        { number: "03", title: "Creating a Strong Brand Identity", duration: "45 Minutes" },
      ],
    },
    {
      section: "05",
      title: "Usability Testing and Iteration",
      lessons: [
        { number: "01", title: "Usability Testing Methods and Techniques", duration: "1 Hour" },
        { number: "02", title: "Analyzing Usability Test Results", duration: "45 Minutes" },
        { number: "03", title: "Iterating and Improving UX Designs", duration: "45 Minutes" },
      ],
    },
  ];

  if (!courseData) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <p className="text-white">No course data available</p>
      </div>
    );
  }

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      {/* Top Banner */}
      <div className="hidden sm:block bg-[linear-gradient(269.56deg,_rgba(161,54,255,1)_0.05%,_rgba(149,44,242,1)_20.26%,_rgba(123,37,199,1)_49.47%,_rgba(98,17,169,1)_82.66%)] text-white text-sm py-3 text-center font-vietnam font-medium">
        Free Courses 🌟 Sale Ends Soon. Get It Now →
      </div>

      <JHomeHeader
        search={searchQuery}
        onSearchChange={setSearchQuery}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Course Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 font-vietnam">
            {courseData.title}
          </h1>
          
          {/* Course Description */}
          <div className="mb-8">
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-vietnam max-w-4xl">
              Welcome to our UI/UX Design course! This comprehensive program will equip you 
              with the knowledge and skills to create exceptional user interfaces (UI) and enhance 
              user experiences (UX). Dive into the world of design thinking, wireframing, 
              prototyping, and usability testing. Below is an overview of the curriculum.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/20 border border-white/10">
              <img
                src={courseData.image}
                alt={courseData.title}
                className="h-full w-full object-cover"
              />
              <button 
                onClick={() => navigate("/video-player", { state: courseData })}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[linear-gradient(269.56deg,_rgba(161,54,255,1)_0.05%,_rgba(149,44,242,1)_20.26%,_rgba(123,37,199,1)_49.47%,_rgba(98,17,169,1)_82.66%)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                </div>
              </button>
            </div>

            {/* Course Curriculum */}
            <div className="mt-8">
              <div className="space-y-6">
                {curriculum.map((section) => (
                  <CurriculumSection
                    key={section.section}
                    section={section.section}
                    title={section.title}
                    lessons={section.lessons}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Instructor Info */}
              <div className="bg-[#151515] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 font-vietnam">
                  Instructor
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {(courseData.instructor || courseData.creator || "A")[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold font-vietnam">
                      {courseData.instructor || courseData.creator || "Ada Nwosu"}
                    </p>
                    <p className="text-xs text-zinc-400 font-vietnam">
                      Machine Learning Engineer At NovaTech
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm font-vietnam">Duration</span>
                  <span className="text-white font-semibold font-vietnam">10 Hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm font-vietnam">Lessons</span>
                  <span className="text-white font-semibold font-vietnam">
                    {courseData.lessons || 15} Lessons
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm font-vietnam">Level</span>
                  <span className="text-white font-semibold font-vietnam">Beginner</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm font-vietnam">Price</span>
                  <span className="text-2xl font-bold text-white font-vietnam">
                    {courseData.price}
                  </span>
                </div>
              </div>

              {/* Enroll Button */}
              <Button className="w-full bg-[linear-gradient(269.56deg,_rgba(161,54,255,1)_0.05%,_rgba(149,44,242,1)_20.26%,_rgba(123,37,199,1)_49.47%,_rgba(98,17,169,1)_82.66%)] hover:opacity-90 text-white font-bold py-6 text-base font-vietnam">
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer backgroundColor="bg-[linear-gradient(269.56deg,_rgba(161,54,255,1)_0.05%,_rgba(149,44,242,1)_20.26%,_rgba(123,37,199,1)_49.47%,_rgba(98,17,169,1)_82.66%)]" />
    </main>
  );
}

function CurriculumSection({
  section,
  title,
  lessons,
}: {
  section: string;
  title: string;
  lessons: LessonItem[];
}) {
  return (
    <div className="bg-[#151515] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl font-bold text-white/10 font-vietnam">{section}</div>
        <h3 className="text-xl font-semibold text-white font-vietnam">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {lessons.map((lesson, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between gap-4 p-4 rounded-lg bg-[#0b0b0b] hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-3 flex-1">
              <span className="text-zinc-500 text-sm font-vietnam mt-1">
                Lesson {lesson.number}
              </span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium group-hover:text-purple-400 transition-colors font-vietnam">
                  {lesson.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lesson.isNew && (
                <span className="bg-[linear-gradient(269.56deg,_rgba(161,54,255,1)_0.05%,_rgba(149,44,242,1)_20.26%,_rgba(123,37,199,1)_49.47%,_rgba(98,17,169,1)_82.66%)] text-white text-xs font-semibold px-2 py-1 rounded font-vietnam">
                  1 Hour
                </span>
              )}
              <div className="flex items-center gap-1 text-zinc-400 text-xs whitespace-nowrap">
                <Clock className="w-3 h-3" />
                <span className="font-vietnam">{lesson.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
