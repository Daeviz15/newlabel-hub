import React, { useEffect, useState } from "react";
import { ResumeCard, ProductCard, TopPick } from "@/components/course-card";
import { HomeHeader } from "../components/home-header";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const resumeItems = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  image: "/assets/dashboard-images/face.jpg",
  title: "The Future Of AI In Everyday Products",
  percent: 72,
  brand: "jsty",
}));

const trendingItems = [
  {
    id: 1,
    price: "$18",
    title: "The Future Of AI In Everyday Products",
    subtitle: "jsty",
    image: "/assets/dashboard-images/face.jpg",
  },
  {
    id: 2,
    price: "$18",
    title: "Firm Foundation",
    subtitle: "—",
    image: "/assets/dashboard-images/firm.jpg",

  },
  {
    id: 3,
    price: "$18",
    title: "The Silent Trauma Of Millennials",
    subtitle: "The House Chronicles",
    image: "/assets/dashboard-images/lady.jpg",

  },
  {
    id: 4,
    price: "$18",
    title: "The Future Of AI In Everyday Products",
    subtitle: "jsty",
    image: "/assets/dashboard-images/face.jpg",

  },
];

const releasesItems = trendingItems;
const recommendedItems = trendingItems;

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };
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

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      updateFromSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateFromSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const filteredResumeItems = resumeItems.filter(
    (i) =>
      i.title.toLowerCase().includes(q) ||
      i.brand.toLowerCase().includes(q)
  );
  const filteredTrendingItems = trendingItems.filter(
    (i) =>
      i.title.toLowerCase().includes(q) ||
      i.subtitle.toLowerCase().includes(q)
  );
  const filteredReleasesItems = releasesItems.filter(
    (i) =>
      i.title.toLowerCase().includes(q) ||
      i.subtitle.toLowerCase().includes(q)
  );
  const filteredRecommendedItems = recommendedItems.filter(
    (i) =>
      i.title.toLowerCase().includes(q) ||
      i.subtitle.toLowerCase().includes(q)
  );

  return (
    <main className="bg-[#0b0b0b] text-white">
      <HomeHeader search={searchQuery} onSearchChange={setSearchQuery} userName={userName ?? undefined} userEmail={userEmail ?? undefined} avatarUrl={avatarUrl ?? undefined} onSignOut={handleSignOut} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Lime hero banner */}
        <section className="py-6">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-lime-500 to-green-600">
            <div className="px-6 py-8 sm:px-8 md:px-10 md:py-10">
              <h1 className="text-2xl font-semibold text-black sm:text-3xl">
                Good Morning, {userName || "there"}
              </h1>
              <p className="mt-2 text-sm text-black/70">
                Great to have you back. Ready to pick up where you left off?
              </p>
            </div>
          </div>
        </section>

        {/* Continue Listening */}
        <Section
          title="Continue Listening"
          description="Learn binge-worthy, career-building lessons from experts across tech media and business."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredResumeItems.map((item) => (
              <ResumeCard
                key={item.id}
                imageSrc={item.image}
                title={item.title}
                percent={item.percent}
                brand={item.brand}
              />
            ))}
          </div>
        </Section>

        {/* What's Trending This week */}
        <Section
          title={"What’s Trending This week"}
          description="Learn binge-worthy, career-building lessons from experts across tech media and business."
        >
          <CardsGrid items={filteredTrendingItems} />
        </Section>

        {/* New Releases */}
        <Section
          title="New Releases"
          description="Learn binge-worthy, career-building lessons from experts across tech media and business."
        >
          <CardsGrid items={filteredReleasesItems} />
        </Section>

        {/* Recommended For You */}
        <Section
          title="Recommended For You"
          description="Learn binge-worthy, career-building lessons from experts across tech media and business."
        >
          <CardsGrid items={filteredRecommendedItems} />
        </Section>

        {/* This week's top pick */}
        <section className="py-8">
          <TopPick />
        </section>

        <div className="h-10" />
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
      <div className="mb-4 space-y-1 sm:mb-6">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
        <p className="text-[12px] text-zinc-400 sm:text-sm">{description}</p>
      </div>
      {children}
    </section>
  );
}

function CardsGrid({
  items,
}: {
  items: {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    price: string;
  }[];
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
        />
      ))}
    </div>
  );
}
