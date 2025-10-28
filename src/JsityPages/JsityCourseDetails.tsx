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
    title: "Course Title",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <JHomeHeader
        search=""
        onSearchChange={() => {}}
        userName={profile.userName || "User"}
        userEmail={profile.userEmail || ""}
        avatarUrl={profile.avatarUrl}
        onSignOut={handleSignOut}
      />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-purple-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={courseData.image}
                alt={courseData.title}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2">{courseData.title}</h1>
                  <p className="text-lg opacity-90">with {courseData.instructor}</p>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-purple-200">
                <CardContent className="p-4 flex flex-col items-center">
                  <Clock className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">8 Hours</p>
                </CardContent>
              </Card>
              <Card className="border-purple-200">
                <CardContent className="p-4 flex flex-col items-center">
                  <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-semibold">Intermediate</p>
                </CardContent>
              </Card>
              <Card className="border-purple-200">
                <CardContent className="p-4 flex flex-col items-center">
                  <Users className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="font-semibold">1,234</p>
                </CardContent>
              </Card>
              <Card className="border-purple-200">
                <CardContent className="p-4 flex flex-col items-center">
                  <Star className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="font-semibold">4.8/5.0</p>
                </CardContent>
              </Card>
            </div>

            {/* Course Description */}
            <Card className="border-purple-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-900">About This Course</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This comprehensive course will take you from beginner to advanced level. 
                  You'll learn essential concepts, practical applications, and real-world projects 
                  that will help you master the subject matter.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Perfect for anyone looking to expand their knowledge and skills in this field. 
                  The course includes video lessons, downloadable resources, and lifetime access to all materials.
                </p>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card className="border-purple-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-900">What You'll Learn</h2>
                <ul className="space-y-3">
                  {[
                    "Master fundamental concepts and principles",
                    "Build real-world projects from scratch",
                    "Understand advanced techniques and best practices",
                    "Gain practical experience with hands-on exercises",
                    "Learn industry-standard tools and workflows",
                    "Develop problem-solving and critical thinking skills"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-purple-600" />
                      </div>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructor Info */}
            <Card className="border-purple-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-900">Your Instructor</h2>
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    {courseData.instructor.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{courseData.instructor}</h3>
                    <p className="text-muted-foreground">{courseData.role || "Expert Instructor"}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Professional educator with years of experience in the field. 
                      Passionate about helping students achieve their learning goals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-purple-200 shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Course Price</p>
                  <p className="text-4xl font-bold text-purple-600 mb-6">{courseData.price}</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleStartLearning}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white py-6 text-lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Learning
                  </Button>

                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 py-6 text-lg"
                  >
                    Add to Cart
                  </Button>
                </div>

                <div className="pt-6 border-t border-purple-200">
                  <h3 className="font-semibold mb-3 text-purple-900">This course includes:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mr-2" />
                      8 hours of video content
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mr-2" />
                      Downloadable resources
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mr-2" />
                      Lifetime access
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mr-2" />
                      Certificate of completion
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mr-2" />
                      Access on mobile and desktop
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <JsityFooter />
    </div>
  );
};

export default JsityCourseDetails;
