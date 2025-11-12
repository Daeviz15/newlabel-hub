import { useLocation, useNavigate } from "react-router-dom";
import { Play, Clock, Star, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import JsityFooter from "./components/JsityFooter";
import { JHomeHeader } from "./components/home-header";
import { useUserProfile } from "@/hooks/use-user-profile";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const JsityCourseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const profile = useUserProfile();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      // If we have data from navigation, use it
      if (location.state) {
        const { data: lessonsData } = await supabase
          .from("course_lessons")
          .select("*")
          .eq("course_id", location.state.id)
          .order("order_number", { ascending: true });

        setCourseData({
          ...location.state,
          lessons: lessonsData || [],
          students: 240,
          rating: 4.8,
        });
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    fetchCourse();
  }, [location.state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!courseData) {
    return <div>Course not found</div>;
  }

  const handleAddToCart = () => {
    addItem({
      id: courseData.id,
      title: courseData.title,
      price: parseFloat(courseData.price.replace(/[^\d.]/g, "")),
      image: courseData.image,
      creator: courseData.creator,
    });
    navigate("/jcart");
  };
  const handleStartLearning = () => {
    const firstLesson = courseData.lessons?.[0];
    navigate("/jsity-video-player", {
      state: {
        courseId: courseData.id,
        lessonId: firstLesson?.id,
        videoUrl: firstLesson?.video_url,
        image: courseData.image,
        title: courseData.title,
        creator: courseData.creator || courseData.instructor,
        price: courseData.price,
        lessons: courseData.lessons,
        description: courseData.description,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const lessons = courseData.lessons || [];

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
              This course will teach you how to design intuitive and visually
              appealing digital products. Learn how to research users, build
              wireframes, and deliver impactful UI/UX experiences.
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

        {lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson: any, i: number) => (
              <div
                key={lesson.id}
                className={`p-4 rounded-lg border flex items-center justify-between transition-all hover:border-purple-600 cursor-pointer ${
                  i === 0
                    ? "border-purple-600 bg-purple-600/10"
                    : "border-gray-800"
                }`}
                onClick={() =>
                  navigate("/jsity-video-player", {
                    state: {
                      courseId: courseData.id,
                      lessonId: lesson.id,
                      videoUrl: lesson.video_url,
                      image: courseData.image,
                      title: lesson.title,
                      creator: courseData.creator || courseData.instructor,
                      price: courseData.price,
                      lessons: courseData.lessons,
                      description: lesson.description,
                    },
                  })
                }
              >
                <div>
                  <h4 className="font-medium">{lesson.title}</h4>
                  {lesson.description && (
                    <p className="text-sm text-gray-400 mt-1">
                      {lesson.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration || "N/A"}</span>
                  </div>
                </div>
                <Play className="w-5 h-5 text-purple-400" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No lessons available yet.</p>
        )}
      </div>

      <JsityFooter />
    </div>
  );
};

export default JsityCourseDetails;
