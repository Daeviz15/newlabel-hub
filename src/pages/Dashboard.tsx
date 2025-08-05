import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Heart,
  BookmarkCheck,
  Star,
  ShoppingCart,
  MoreHorizontal
} from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate("/login");
        } else {
          // Fetch user profile when authenticated
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/login");
      } else {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Logged out successfully",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const CourseCard = ({ title, instructor, price, image, rating, reviews }: {
    title: string;
    instructor: string;
    price: string;
    image: string;
    rating?: number;
    reviews?: string;
  }) => (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden group cursor-pointer hover:bg-gray-750 transition-colors">
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-gray-900/80 text-white border-0">${price}</Badge>
        </div>
        <div className="absolute top-3 right-3 space-x-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-gray-900/80 hover:bg-gray-900">
            <Heart className="h-4 w-4 text-white" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-gray-900/80 hover:bg-gray-900">
            <BookmarkCheck className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
        <p className="text-gray-400 text-xs mb-2">{instructor}</p>
        {rating && (
          <div className="flex items-center text-xs text-gray-400">
            <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
            <span>{rating} ({reviews})</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const userName = profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <span className="text-black font-bold text-sm">N</span>
              </div>
              <span className="text-white font-semibold">newlabel</span>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-white text-sm">Students+</a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">About Us</a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">Contact Us</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, sessions, Edits"
                className="pl-10 pr-4 py-2 w-80 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-gray-700 text-white text-sm">
                {profile?.full_name?.split(' ').map(n => n[0]).join('') || user.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-gray-300 hover:text-white"
            >
              John Doe
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-green-500 rounded-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Good Morning, {userName}</h1>
          <p className="text-black/80">Great to have you back. Ready to split up where you left off?</p>
        </div>

        {/* What's Trending This Week */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">What's Trending This week</h2>
          <p className="text-gray-400 text-sm mb-6">Learn binge-worthy, career-building lessons from experts across tech media and business.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CourseCard
              title="The Future Of AI In Everyday Products"
              instructor="Jaly"
              price="18"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
              rating={4.8}
              reviews="1.2k"
            />
            <CourseCard
              title="Firm Foundation"
              instructor="⚡"
              price="18"
              image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
            />
            <CourseCard
              title="The Silent Trauma Of Millennials"
              instructor="The House Chronicles"
              price="18"
              image="https://images.unsplash.com/photo-1494790108755-2616c6b4b2b9?w=400&h=300&fit=crop"
            />
            <CourseCard
              title="The Future Of AI In Everyday Products"
              instructor="Jaly"
              price="18"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
            />
          </div>
        </section>

        {/* New Releases */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">New Releases</h2>
          <p className="text-gray-400 text-sm mb-6">Learn binge-worthy, career-building lessons from experts across tech media and business.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CourseCard
              title="The Future Of AI In Everyday Products"
              instructor="Jaly"
              price="18"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
            />
            <CourseCard
              title="Firm Foundation"
              instructor="⚡"
              price="18"
              image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
            />
            <CourseCard
              title="The Silent Trauma Of Millennials"
              instructor="The House Chronicles"
              price="18"
              image="https://images.unsplash.com/photo-1494790108755-2616c6b4b2b9?w=400&h=300&fit=crop"
            />
            <CourseCard
              title="The Future Of AI In Everyday Products"
              instructor="Jaly"
              price="18"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
            />
          </div>
        </section>

        {/* Recommended For You */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">Recommended For You</h2>
          <p className="text-gray-400 text-sm mb-6">Learn binge-worthy, career-building lessons from experts across tech media and business.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CourseCard
              title="The Future Of AI In Everyday Products"
              instructor="Jaly"
              price="18"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
            />
            <CourseCard
              title="Firm Foundation"
              instructor="⚡"
              price="18"
              image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
            />
            <CourseCard
              title="The Silent Trauma Of Millennials"
              instructor="The House Chronicles"
              price="18"
              image="https://images.unsplash.com/photo-1494790108755-2616c6b4b2b9?w=400&h=300&fit=crop"
            />
            <CourseCard
              title="The Future Of AI In Everyday Products"
              instructor="Jaly"
              price="18"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
            />
          </div>
        </section>

        {/* This Week's Top Pick */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">This week's top pick</h2>
          
          <Card className="bg-gray-800 border-gray-700 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3">
                <img 
                  src="https://images.unsplash.com/photo-1594736797933-d0f50b7b8972?w=500&h=400&fit=crop" 
                  alt="Featured Course" 
                  className="w-full h-64 lg:h-full object-cover"
                />
              </div>
              <CardContent className="lg:w-2/3 p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  The Future Of AI In Everyday Products
                </h3>
                <div className="mb-4">
                  <p className="text-green-400 font-semibold mb-1">Ada Nwosu</p>
                  <p className="text-gray-400 text-sm">Former software engineer at StubHub</p>
                </div>
                <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold w-fit">
                  Buy This Course
                </Button>
              </CardContent>
            </div>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-green-500 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-green-500 font-bold text-sm">N</span>
              </div>
              <span className="text-black font-semibold">newlabel</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1 max-w-2xl">
              <div>
                <h4 className="text-black font-semibold mb-2">Home</h4>
                <ul className="space-y-1">
                  <li><a href="#" className="text-black/80 hover:text-black text-sm">Courses</a></li>
                  <li><a href="#" className="text-black/80 hover:text-black text-sm">Our Testimonials</a></li>
                  <li><a href="#" className="text-black/80 hover:text-black text-sm">Our FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-black font-semibold mb-2">About Us</h4>
                <ul className="space-y-1">
                  <li><a href="#" className="text-black/80 hover:text-black text-sm">Company</a></li>
                  <li><a href="#" className="text-black/80 hover:text-black text-sm">Achievements</a></li>
                  <li><a href="#" className="text-black/80 hover:text-black text-sm">Our Goals</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-black font-semibold mb-2">Social Profiles</h4>
                <div className="flex space-x-2">
                  <a href="#" className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-green-500 text-sm">f</span>
                  </a>
                  <a href="#" className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-green-500 text-sm">t</span>
                  </a>
                  <a href="#" className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-green-500 text-sm">in</span>
                  </a>
                </div>
              </div>
              
              <div>
                <div className="text-black text-sm space-y-1">
                  <p>newlabel@online.com</p>
                  <p>+91 902 23 25 09</p>
                  <p>Somewhere in the World</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-black/20 mt-8 pt-4">
            <p className="text-black text-sm text-center">© 2023 newlabel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;