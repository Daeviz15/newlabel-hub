import React, { useState } from "react";
import { ProductCard, TopPick } from "@/components/course-card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import { THomeHeader } from "./components/home-header";
import GFooter from "./components/GFooter";

const courseData = [
  {
    id: 1,
    price: "$18",
    title: "The Future Of AI In Everyday Products",
    subtitle: "Ada Nwosu",
    role: "Machine Learning Engineer At NewsTech",
    image: "/assets/dashboard-images/face.jpg",
  },
  {
    id: 2,
    price: "$18",
    title: "The Future Of AI In Everyday Products",
    subtitle: "Ada Nwosu",
    role: "Machine Learning Engineer At NewsTech",
    image: "/assets/dashboard-images/firm.jpg",
  },
  {
    id: 3,
    price: "$18",
    title: "The Future Of AI In Everyday Products",
    subtitle: "Ada Nwosu",
    role: "Machine Learning Engineer At NewsTech",
    image: "/assets/dashboard-images/lady.jpg",
  },
  {
    id: 4,
    price: "$18",
    title: "The Future Of AI In Everyday Products",
    subtitle: "Ada Nwosu",
    role: "Machine Learning Engineer At NewsTech",
    image: "/assets/dashboard-images/only.jpg",
  },
];

const trendingItems = courseData;
const releasesItems = courseData;
const recommendedItems = courseData;

export default function GDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { userName, userEmail, avatarUrl } = useUserProfile();

  // Function to get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredTrendingItems = trendingItems.filter(
    (i) =>
      i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q)
  );
  const filteredReleasesItems = releasesItems.filter(
    (i) =>
      i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q)
  );
  const filteredRecommendedItems = recommendedItems.filter(
    (i) =>
      i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q)
  );

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <div className="flex flex-col">
        {/* Top Banner - Desktop only */}
        <div className="block bg-[#70E002] text-black text-sm py-3 text-center font-vietnam font-medium rounded-md">
          Free Courses 🌟 Sale Ends Soon. Get It Now →
        </div>

        <THomeHeader
          search={searchQuery}
          onSearchChange={setSearchQuery}
          userName={userName ?? undefined}
          userEmail={userEmail ?? undefined}
          avatarUrl={avatarUrl ?? undefined}
          onSignOut={handleSignOut}
        />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
          {/* Hero Banner */}
          <section className="py-6 sm:py-8">
            <div className="overflow-hidden rounded-2xl bg-[linear-gradient(269.56deg,_#70E002_0%,_#69DA02_25%,_#56CA01_60%,_#38B100_100%)]">
              <div className="px-6 py-12 sm:px-8 md:px-12 md:py-16 lg:py-20">
                <h1 className="text-3xl font-bold font-nunito text-white sm:text-4xl md:text-5xl">
                  {getTimeBasedGreeting()}, {userName || "John"}
                </h1>
                <p className="mt-3 text-[20px] font-vietnam text-white/90 md:text-[20px]">
                  Great to have you back. Ready to pick up where you left off?
                </p>
              </div>
            </div>
          </section>

          {/* What's Trending This week */}
          <Section
            title="What's Trending This week"
            description="Learn binge-worthy, career-building lessons from experts across tech media and business."
          >
            <CardsGrid items={filteredTrendingItems} navigate={navigate} />
          </Section>

          {/* New Releases */}
          <Section
            title="New Releases"
            description="Learn binge-worthy, career-building lessons from experts across tech media and business."
          >
            <CardsGrid items={filteredReleasesItems} navigate={navigate} />
          </Section>

          {/* Recommended For You */}
          <Section
            title="Recommended For You"
            description="Learn binge-worthy, career-building lessons from experts across tech media and business."
          >
            <CardsGrid items={filteredRecommendedItems} navigate={navigate} />
          </Section>

          {/* This week's top pick */}
          <Section title="This week's top pick" description="">
            <TopPick accent="lime" imageFit="cover" />
          </Section>

          <div className="h-16" />
        </div>
        <GFooter />
      </div>
    </main>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-6 sm:py-8">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-vietnam">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-zinc-400 sm:text-base">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function CardsGrid({
  items,
  navigate,
}: {
  items: {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    price: string;
  }[];
  navigate: any;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <ProductCard
          key={it.id}
          imageSrc={it.image}
          title={it.title}
          subtitle={it.subtitle}
          price={it.price}
          bgColor="ring-[#70E002]"
          priceAccent="thc"
          onClick={() =>
            navigate("/gospel-course-details", {
              state: {
                id: it.id.toString(),
                image: it.image,
                title: it.title,
                creator: it.subtitle,
                price: it.price,
                instructor: it.subtitle,
              },
            })
          }
        />
      ))}
    </div>
  );
}
