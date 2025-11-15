import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ThcFooter from "./components/ThcFooter";
import { useUserProfile } from "@/hooks/use-user-profile";
import { THomeHeader } from "./components/home-header";
import ChannelMetricsCarousel from "@/components/channel-metrics-carousel";
import { PodcastCard } from "@/components/podcast-card";

const podcastData = [
  {
    id: 1,
    title: "The Daily Chronicles",
    host: "Alex Thompson",
    episodeCount: 156,
    image: "/assets/dashboard-images/face.jpg",
  },
  {
    id: 2,
    title: "Late Night Talks",
    host: "Jamie Wilson",
    episodeCount: 89,
    image: "/assets/dashboard-images/firm.jpg",
  },
  {
    id: 3,
    title: "Tech Bytes Podcast",
    host: "Sarah Chen",
    episodeCount: 124,
    image: "/assets/dashboard-images/lady.jpg",
  },
  {
    id: 4,
    title: "Story Time Sessions",
    host: "Marcus Brown",
    episodeCount: 72,
    image: "/assets/dashboard-images/only.jpg",
  },
  {
    id: 5,
    title: "The Midnight Hour",
    host: "Nicole Davis",
    episodeCount: 98,
    image: "/assets/dashboard-images/Cart1.jpg",
  },
  {
    id: 6,
    title: "Conversations & Coffee",
    host: "David Lee",
    episodeCount: 145,
    image: "/assets/podcast-episode.jpg",
  },
];

const trendingPodcasts = podcastData;
const newReleases = podcastData.slice(2);
const recommendedPodcasts = podcastData.slice(1);

export default function ThcPodcastDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { userName, userEmail, avatarUrl } = useUserProfile();

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
  const filteredTrendingPodcasts = trendingPodcasts.filter(
    (i) => i.title.toLowerCase().includes(q) || i.host.toLowerCase().includes(q)
  );
  const filteredNewReleases = newReleases.filter(
    (i) => i.title.toLowerCase().includes(q) || i.host.toLowerCase().includes(q)
  );
  const filteredRecommendedPodcasts = recommendedPodcasts.filter(
    (i) => i.title.toLowerCase().includes(q) || i.host.toLowerCase().includes(q)
  );

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <div className="flex flex-col">
        <THomeHeader
          search={searchQuery}
          onSearchChange={setSearchQuery}
          userName={userName ?? undefined}
          userEmail={userEmail ?? undefined}
          avatarUrl={avatarUrl ?? undefined}
          onSignOut={handleSignOut}
        />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
          {/* Hero Carousel */}
          <section className="py-6 sm:py-8">
            <ChannelMetricsCarousel accentColor="green" />
          </section>

          {/* Trending Podcasts */}
          <Section
            title="Trending Now"
            description="Popular podcasts everyone is listening to right now."
          >
            <PodcastsGrid
              items={filteredTrendingPodcasts}
              navigate={navigate}
            />
          </Section>

          {/* New Episodes */}
          <Section
            title="New Episodes"
            description="The latest episode releases from your favorite shows."
          >
            <PodcastsGrid items={filteredNewReleases} navigate={navigate} />
          </Section>

          {/* Recommended For You */}
          <Section
            title="Recommended For You"
            description="Personalized picks based on your listening history."
          >
            <PodcastsGrid
              items={filteredRecommendedPodcasts}
              navigate={navigate}
            />
          </Section>

          <div className="h-16" />
        </div>
        <ThcFooter />
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

function PodcastsGrid({
  items,
  navigate,
}: {
  items: {
    id: number;
    image: string;
    title: string;
    host: string;
    episodeCount: number;
  }[];
  navigate: any;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((podcast) => (
        <PodcastCard
          key={podcast.id}
          imageSrc={podcast.image}
          title={podcast.title}
          host={podcast.host}
          episodeCount={podcast.episodeCount}
          onClick={() =>
            navigate("/thc-video-player", {
              state: {
                id: podcast.id.toString(),
                image: podcast.image,
                title: podcast.title,
                host: podcast.host,
                episodeCount: podcast.episodeCount,
              },
            })
          }
        />
      ))}
    </div>
  );
}
