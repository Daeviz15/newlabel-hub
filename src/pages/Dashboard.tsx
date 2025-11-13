import type React from "react";
import { useState, useEffect } from "react";
import { ResumeCard, ProductCard, TopPick } from "@/components/course-card";
import { HomeHeader } from "../components/home-header";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useNavigate } from "react-router-dom";
import ChannelMetricsCarousel from "@/components/channel-metrics-carousel";

const resumeItems = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  image: "/assets/dashboard-images/face.jpg",
  title: "The Future Of AI In Everyday Products",
  percent: 72,
  brand: "jsty",
}));

export default function Dashboard() {
  const router = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { userName, userEmail, avatarUrl } = useUserProfile();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'jsity')
        .order('created_at', { ascending: false });
      
      if (data) {
        setCourses(data.map(course => ({
          id: course.id,
          price: `$${course.price}`,
          title: course.title,
          subtitle: course.instructor || 'Instructor',
          image: course.image_url || '/assets/dashboard-images/face.jpg',
          category: course.category,
        })));
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router("/login");
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredResumeItems = resumeItems.filter(
    (i) =>
      i.title.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q)
  );
  const filteredCourses = courses.filter(
    (i) =>
      i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q)
  );

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

  return (
    <main className="bg-[#0b0b0b] text-white">
      <div className="min-h-screen bg-background flex flex-col">
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <section className="py-6">
            <ChannelMetricsCarousel />
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
                  onClick={() =>
                    router(
                      `/course-details?id=${item.id}&image=${encodeURIComponent(
                        item.image
                      )}&title=${encodeURIComponent(
                        item.title
                      )}&creator=${encodeURIComponent(item.brand)}&price=18`
                    )
                  }
                />
              ))}
            </div>
          </Section>

          {/* What's Trending This week */}
          <Section
            title={"What's Trending This week"}
            description="Learn binge-worthy, career-building lessons from experts across tech media and business."
          >
            {loading ? (
              <p className="text-gray-400">Loading courses...</p>
            ) : (
              <CardsGrid items={filteredCourses.slice(0, 4)} router={router} />
            )}
          </Section>

          {/* New Releases */}
          <Section
            title="New Releases"
            description="Learn binge-worthy, career-building lessons from experts across tech media and business."
          >
            {loading ? (
              <p className="text-gray-400">Loading courses...</p>
            ) : (
              <CardsGrid items={filteredCourses} router={router} />
            )}
          </Section>

          {/* Recommended For You */}
          <Section
            title="Recommended For You"
            description="Learn binge-worthy, career-building lessons from experts across tech media and business."
          >
            {loading ? (
              <p className="text-gray-400">Loading courses...</p>
            ) : (
              <CardsGrid items={filteredCourses.slice(0, 4)} router={router} />
            )}
          </Section>

          {/* This week's top pick */}
          <section className="py-8">
            <TopPick />
          </section>

          <div className="h-10" />
        </div>
        <Footer />
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
  router,
}: {
  items: {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    price: string;
    category?: string;
  }[];
  router: ReturnType<typeof useNavigate>;
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
          onClick={() => {
            const detailsRoute = it.category === 'jsity' 
              ? '/jsity-course-details'
              : it.category === 'thc'
              ? '/thc-course-details'
              : '/gospel-course-details';
            router(detailsRoute, { 
              state: { 
                id: it.id,
                image: it.image,
                title: it.title,
                creator: it.subtitle,
                price: it.price
              } 
            });
          }}
        />
      ))}
    </div>
  );
}
