import { useLocation, useNavigate } from "react-router-dom";
import { Play, Clock, Star, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    students: 240,
    rating: 4.8,
  };

  const handleAddToCart = async () => {
    // Parse price to number, removing currency symbols
    const numericPrice = typeof courseData.price === 'string' 
      ? parseFloat(courseData.price.replace(/[^\d.]/g, ''))
      : courseData.price;
    
    await addItem({
      id: courseData.id,
      title: courseData.title,
      price: numericPrice,
      image: courseData.image,
      creator: courseData.instructor || courseData.creator,
    });
    toast.success("Added to cart successfully!");
  };

  const handleStartLearning = () =>
    navigate("/jsity-video-player", {
      state: {
        id: String(courseData.id),
        image: courseData.image,
        title: courseData.title,
        creator: courseData.creator || courseData.instructor,
        price: courseData.price,
        lessons: courseData.lessons,
        date: courseData.date,
        description: courseData.description,
      },
    });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const curriculum = [
    {
      section: "01",
      title: "Introduction to UI/UX Design",
      lessons: [
        { title: "Understanding UI/UX Design Principles", duration: "45 Minutes" },
        { title: "Importance of User-Centered Design", duration: "1 Hour", highlighted: true },
        { title: "The Role of UI/UX Design in Product Development", duration: "45 Minutes" },
      ],
    },
    {
      section: "02",
      title: "User Research and Analysis",
      lessons: [
        { title: "Conducting User Research and Interviews", duration: "1 Hour" },
        { title: "Analyzing User Needs and Behavior", duration: "1 Hour" },
        { title: "Creating User Personas and Scenarios", duration: " 45Minutes" },
      ],
    },
    {
      section: "03",
      title: "Wireframing and Prototyping",
      lessons: [
        { title: "Introduction to Wireframing Tools and Techniques", duration: "1 Hour" },
        { title: "Creating Low-Fidelity Wireframes", duration: "1 Hour" },
        { title: "Prototyping and Interactive Mockupss", duration: "1 Hour" },
      ],
    },
    {
      section: "04",
      title: "Visual Design and Branding",
      lessons: [
        { title: "Color Theory and Typography in UI Design", duration: "1 Hour" },
        { title: "Visual Hierarchy and Layout Design", duration: "1 Hour" },
        { title: "Creating a Strong Brand Identity", duration: "45 Minutes" },
      ],
    },
    {
      section: "05",
      title: "Usability Testing and Iteration",
      lessons: [
        { title: "Usability Testing Methods and Techniques", duration: "1 Hour" },
        { title: "Analyzing Usability Test Resultsr", duration: "45 Hour" },
        { title: "Iterating and Improving UX Designs", duration: "45 Minutes" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <JHomeHeader
        search=""
        onSearchChange={() => {}}
        userName={profile.userName || "User"}
        userEmail={profile.userEmail || ""}
        avatarUrl={profile.avatarUrl}
        onSignOut={handleSignOut}
      />

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-28 pb-20 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Video Preview */}
          <div className="relative rounded-2xl overflow-hidden aspect-video group shadow-lg">
            <img
              src={courseData.image}
              alt={courseData.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <button
              onClick={handleStartLearning}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center group-hover:bg-purple-700 transition-all group-hover:scale-110">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </button>
          </div>

          {/* Text Section */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {courseData.title}
            </h1>
            <p className="text-gray-400 mb-6 leading-relaxed">
              This course will teach you how to design intuitive and visually appealing
              digital products. Learn how to research users, build wireframes, and
              deliver impactful UI/UX experiences.
            </p>

            <div className="flex items-center gap-6 mb-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>{courseData.students}+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{courseData.rating} Rating</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleStartLearning}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Start Learning
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToCart}
                className="border-gray-700 hover:border-purple-600  hover:bg-purple-600 hover:text-white px-6 py-3 rounded-xl"
              >
                Add to Cart ({courseData.price})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="container mx-auto px-4 pb-24 max-w-5xl">
        <h2 className="text-3xl font-bold mb-12">Course Curriculum</h2>

        <div className="space-y-12">
          {curriculum.map((section) => (
            <div key={section.section} className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-xl font-semibold mb-6 text-purple-400">
                {section.section}. {section.title}
              </h3>
              <div className="space-y-4">
                {section.lessons.map((lesson, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border flex items-center justify-between transition-all hover:border-purple-600 ${
                      lesson.highlighted
                        ? "border-purple-600 bg-purple-600/10"
                        : "border-gray-800"
                    }`}
                  >
                    <div>
                      <h4 className="font-medium">{lesson.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                    <BookOpen className="w-5 h-5 text-gray-500" />
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
