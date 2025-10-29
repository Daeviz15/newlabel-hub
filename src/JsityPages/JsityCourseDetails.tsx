import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Clock, BarChart3, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import JsityFooter from "./components/JsityFooter";
import { JHomeHeader } from "./components/home-header";
import { useUserProfile } from "@/hooks/use-user-profile";
import { supabase } from "@/integrations/supabase/client";

const JsityCourseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const profile = useUserProfile();
  
  const courseData = location.state || {
    id: "1",
    image: "/assets/dashboard-images/Cart1.jpg",
    title: "The Future Of AI In Everyday Products",
    creator: "Instructor Name",
    price: "₦5,000",
    instructor: "Instructor Name",
    role: "Expert Instructor",
  };

  const handleAddToCart = () => {
    addItem({
      id: courseData.id,
      title: courseData.title,
      price: courseData.price,
      image: courseData.image,
      creator: courseData.instructor,
    });
    toast.success("Added to cart successfully!");
  };

  const handleStartLearning = () => {
    navigate("/video-player", { state: courseData });
  };

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
        { title: "Understanding UI/UX Design Principles", duration: "45 Minutes", number: "01" },
        { title: "Importance of User-Centered Design", duration: "1 Hour", number: "02", highlighted: true },
        { title: "The Role of UI/UX Design in Product Development", duration: "45 Minutes", number: "03" },
      ]
    },
    {
      section: "02",
      title: "User Research and Analysis",
      lessons: [
        { title: "Conducting User Research and Interviews", duration: "1 Hour", number: "01" },
        { title: "Analyzing User Needs and Behavior", duration: "1 Hour", number: "02" },
        { title: "Creating User Personas and Scenarios", duration: "45 Minutes", number: "03" },
      ]
    },
    {
      section: "03",
      title: "Wireframing and Prototyping",
      lessons: [
        { title: "Introduction to Wireframing Tools and Techniques", duration: "1 Hour", number: "01" },
        { title: "Creating Low-Fidelity Wireframes", duration: "1 Hour", number: "02" },
        { title: "Prototyping and Interactive Mockups", duration: "1 Hour", number: "03" },
      ]
    },
    {
      section: "04",
      title: "Visual Design and Branding",
      lessons: [
        { title: "Color Theory and Typography in UI Design", duration: "1 Hour", number: "01" },
        { title: "Visual Hierarchy and Layout Design", duration: "1 Hour", number: "02" },
        { title: "Creating a Strong Brand Identity", duration: "45 Minutes", number: "03" },
      ]
    },
    {
      section: "05",
      title: "Usability Testing and Iteration",
      lessons: [
        { title: "Usability Testing Methods and Techniques", duration: "1 Hour", number: "01" },
        { title: "Analyzing Usability Test Results", duration: "45 Minutes", number: "02" },
        { title: "Iterating and Improving UX Designs", duration: "45 Minutes", number: "03" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <JHomeHeader
        search=""
        onSearchChange={() => {}}
        userName={profile.userName || "User"}
        userEmail={profile.userEmail || ""}
        avatarUrl={profile.avatarUrl}
        onSignOut={handleSignOut}
      />

      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left: Title and Description */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              {courseData.title}
            </h1>
            <p className="text-gray-400 leading-relaxed text-lg">
              Welcome to our UI/UX Design course! This comprehensive program will equip you 
              with the knowledge and skills to create exceptional user interfaces (UI) and user 
              experiences (UX). Dive into the world of design thinking, wireframing, prototyping, 
              and usability testing. Below is an overview of the curriculum.
            </p>
          </div>

          {/* Right: Empty for spacing */}
          <div></div>
        </div>

        {/* Video Player Section */}
        <div className="mb-16">
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-900">
            <img
              src={courseData.image}
              alt={courseData.title}
              className="w-full h-full object-cover"
            />
            <button 
              onClick={handleStartLearning}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center group-hover:bg-purple-700 transition-all group-hover:scale-110">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </button>
          </div>
        </div>

        {/* Curriculum Sections */}
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
          {curriculum.map((section) => (
            <div key={section.section}>
              {/* Section Header */}
              <div className="mb-6">
                <h2 className="text-6xl font-bold text-white mb-3">{section.section}</h2>
                <h3 className="text-xl font-semibold text-white">{section.title}</h3>
              </div>

              {/* Lessons */}
              <div className="space-y-4">
                {section.lessons.map((lesson) => (
                  <div 
                    key={lesson.number}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      lesson.highlighted 
                        ? 'border-purple-600 bg-purple-600/10' 
                        : 'border-gray-800 bg-transparent hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Lesson {lesson.number}</p>
                        <h4 className="text-white font-medium leading-snug mb-2">
                          {lesson.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {lesson.highlighted && (
                          <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold">
                            1 Hour
                          </span>
                        )}
                        {!lesson.highlighted && (
                          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{lesson.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <JsityFooter />
    </div>
  );
};

export default JsityCourseDetails;
