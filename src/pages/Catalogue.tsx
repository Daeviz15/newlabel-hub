import { HomeHeader } from "@/components/home-header";
import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import Tab from "@/components/Tab";
import { ProductCard, ResumeCard } from "@/components/course-card";

const Catalogue = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const browse = [
    {
      id: 1,
      price: "$18",
      title: "The Future Of AI In Everyday Product",
      subtitle: "jsty",
      image: "/assets/dashboard-images/face.jpg",
      liked: false,
      brand: "jsty",
    },
    {
      id: 2,
      price: "$18",
      title: "Firm Foundation",
      subtitle: "—",
      image: "/assets/dashboard-images/firm.jpg",
      liked: false,
      brand: "jsty",
    },
    {
      id: 3,
      price: "$18",
      title: "The Silent Trauma Of Millennials",
      subtitle: "The House Chronicles",
      image: "/assets/dashboard-images/lady.jpg",
      liked: false,
      brand: "jsty",
    },
    {
      id: 4,
      price: "$18",
      title: "The Future Of AI In Everyday Products",
      subtitle: "jsty",
      image: "/assets/dashboard-images/face.jpg",
      liked: false,
      brand: "jsty",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const updateFromSession = (session: any) => {
      const user = session?.user || null;
      if (user) {
        const meta = user.user_metadata || {};
        setUserEmail(user.email ?? null);
        setUserName(meta.full_name || meta.name || user.email || null);
        setAvatarUrl(meta.avatar_url || meta.picture || null);
        setTimeout(async () => {
          const { data, error } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("user_id", user.id)
            .maybeSingle();
          if (!error && data) {
            if (data.full_name) setUserName(data.full_name);
            if (data.avatar_url) setAvatarUrl(data.avatar_url);
          }
        }, 0);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        updateFromSession(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateFromSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <div className="bg-brand-green text-black text-sm sm:text-base m-4 py-2 text-center font-medium rounded-md sm:hidden">
        <a href="/free-courses" className="hover:underline">
          Free Courses 🌟 Sale Ends Soon, Get It Now →
        </a>
      </div>
      <HomeHeader
        search={searchQuery}
        onSearchChange={setSearchQuery}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />

      {/* Hero Section - Fully Responsive */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row w-full gap-6 sm:gap-8 lg:gap-12 mt-12 sm:mt-16 lg:mt-20 mb-20 sm:mb-28 lg:mb-40">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-vietnam lg:w-[500px] text-[#EDEDED] leading-tight">
            Curated Content From Your Favorite Creators
          </h1>
          <p className="w-full lg:w-1/2 font-light text-sm sm:text-base text-[#EDEDED] font-vietnam leading-relaxed">
            Welcome to our online course page, where you can enhance your skills
            in design and development. Choose from our carefully curated
            selection of 10 courses designed to provide you with comprehensive
            knowledge and practical experience. Explore the courses below and
            find the perfect fit for your learning journey.
          </p>
        </div>
        <div className="w-full h-[1px] bg-[#A3A3A3]/20 mt-12 mb-8"></div>


        {/* Browse Section - Fully Responsive */}
        <div className="flex flex-col gap-6 sm:gap-8 pb-12 sm:pb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-nunito font-bold">
            Browse by category
          </h1>

          {/* Tab Component - Horizontal scroll on mobile */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <Tab />
          </div>

          {/* Product Grid 1 - Responsive columns */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {browse.map((it) => (
              <ProductCard
                key={it.id}
                imageSrc={it.image}
                title={it.title}
                subtitle={it.subtitle}
                price={it.price}
                onClick={() => navigate("/video-details", { 
                  state: { 
                    id: it.id.toString(), 
                    image: it.image, 
                    title: it.title, 
                    creator: it.subtitle, 
                    price: it.price 
                  } 
                })}
              />
            ))}
          </div>

          {/* Product Grid 2 */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {browse.map((it) => (
              <ProductCard
                key={it.id}
                imageSrc={it.image}
                title={it.title}
                subtitle={it.subtitle}
                price={it.price}
                onClick={() => navigate("/video-details", { 
                  state: { 
                    id: it.id.toString(), 
                    image: it.image, 
                    title: it.title, 
                    creator: it.subtitle, 
                    price: it.price 
                  } 
                })}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {browse.map((it) => (
              <ProductCard
                key={it.id}
                imageSrc={it.image}
                title={it.title}
                subtitle={it.subtitle}
                price={it.price}
                onClick={() => navigate("/video-details", { 
                  state: { 
                    id: it.id.toString(), 
                    image: it.image, 
                    title: it.title, 
                    creator: it.subtitle, 
                    price: it.price 
                  } 
                })}
              />
            ))}
          </div>

          <button className="flex justify-center items-center text-xs sm:text-sm w-full bg-gray-500/25 hover:bg-gray-500/35 transition-colors h-10 sm:h-12 mt-3 mb-6 sm:mb-10 rounded-sm font-nunito font-bold cursor-pointer active:scale-[0.98]">
            Load More
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Catalogue;
