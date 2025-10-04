import { HomeHeader } from "@/components/home-header";
import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import Tab from "@/components/tab";
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
      title: "The Future Of AI In Everyday Products",
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
    <main className="bg-[#0b0b0b] text-white">
      <HomeHeader
        search={searchQuery}
        onSearchChange={setSearchQuery}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="flex w-full gap-5 mt-20 mb-40">
          <h1 className="text-3xl font-semibold font-vietnam w-[500px] text-[#EDEDED]">
            Curated Content From Your Favorite Creators
          </h1>
          <p className="w-1/2 font-light text-sm text-[#EDEDED] font-vietnam">
            Welcome to our online course page, where you can enhance your skills
            in design and development. Choose from our carefully curated
            selection of 10 courses designed to provide you with comprehensive
            knowledge and practical experience. Explore the courses below and
            find the perfect fit for your learning journey.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-nunito font-bold">Browse by category</h1>
          <Tab />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {browse.map((it) => (
              <ProductCard
                key={it.id}
                imageSrc={it.image}
                title={it.title}
                subtitle={it.subtitle}
                price={it.price}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {browse.map((it) => (
              <ProductCard
                key={it.id}
                imageSrc={it.image}
                title={it.title}
                subtitle={it.subtitle}
                price={it.price}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {browse.map((it) => (
              <ProductCard
                key={it.id}
                imageSrc={it.image}
                title={it.title}
                subtitle={it.subtitle}
                price={it.price}
              />
            ))}
          </div>
          <div className="flex justify-center items-center text-[13px] w-full bg-gray-500/25 h-10 mt-3 mb-10 rounded-sm font-nunito font-bold ">Load More</div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Catalogue;
