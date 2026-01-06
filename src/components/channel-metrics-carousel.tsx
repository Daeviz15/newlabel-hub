import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { useNavigate } from "react-router-dom";

interface TrendingItem {
  id: string;
  price: string;
  title: string;
  subtitle: string;
  image: string;
  category?: string;
}

interface CarouselProps {
  accentColor?: "green" | "purple" | "lime";
}

export default function ChannelMetricsCarousel({ accentColor = "green" }: CarouselProps) {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleEnroll = (item: TrendingItem) => {
    addItem({
      id: item.id,
      title: item.title,
      price: parseFloat(item.price.replace(/[^\d.]/g, "")),
      image: item.image,
      creator: item.subtitle,
    });
    navigate("/checkout");
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data && data.length > 0) {
        setTrendingItems(data.map(course => ({
          id: course.id,
          price: `₦${course.price}`,
          title: course.title,
          subtitle: course.instructor || 'Expert Instructor',
          image: course.image_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&h=600&fit=crop&q=80',
          category: course.category,
        })));
      }
    };

    fetchCourses();
  }, []);

  const gradientOverlays = {
    green: "bg-gradient-to-t from-[#70E002]/95 via-[#70E002]/60 to-transparent",
    purple: "bg-gradient-to-t from-purple-600/95 via-purple-600/60 to-transparent",
    lime: "bg-gradient-to-t from-lime-500/95 via-lime-500/60 to-transparent",
  };

  const badgeColors = {
    green: "bg-[#70E002]/20 border-[#70E002]/30 text-white",
    purple: "bg-purple-500/20 border-purple-500/30 text-white",
    lime: "bg-lime-500/20 border-lime-500/30 text-white",
  };

  const buttonColors = {
    green: "bg-[#70E002] hover:bg-[#5EC002] text-black",
    purple: "bg-purple-600 hover:bg-purple-700 text-white",
    lime: "bg-lime-500 hover:bg-lime-600 text-black",
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || trendingItems.length === 0) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingItems.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlay, trendingItems.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    
    // Resume autoplay after 10 seconds
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % trendingItems.length);
    setIsAutoPlay(false);
    
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? trendingItems.length - 1 : prev - 1
    );
    setIsAutoPlay(false);
    
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);
  };


  if (trendingItems.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="w-full">
        <div className="relative">
          {/* Main carousel container */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            {/* Carousel track */}
            <div className="relative w-full h-[360px] md:h-[420px]">
              <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {trendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-full h-full relative flex-shrink-0"
                  >
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Green gradient overlay */}
                    <div className={`absolute inset-0 ${gradientOverlays[accentColor]}`} />

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                      <div className="space-y-3 md:space-y-4 max-w-3xl">
                        {/* Badge */}
                        <div className="inline-flex">
                          <span className={`px-4 py-1.5 backdrop-blur-md rounded-full text-xs font-semibold border ${badgeColors[accentColor]}`}>
                            {item.category === 'podcast' ? 'Featured Series' : 'Featured Course'}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                          {item.title}
                        </h2>

                        {/* Subtitle */}
                        <p className="text-sm md:text-base lg:text-lg text-white/90 font-medium">
                          {item.subtitle}
                        </p>

                        {/* Price and CTA */}
                        {item.price !== "₦0" && (
                          <div className="flex items-center gap-4 md:gap-6 pt-2">
                            <span className="text-xl md:text-3xl font-bold text-white">
                              {item.price}
                            </span>
                            <button 
                              onClick={() => handleEnroll(item)}
                              className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all transform hover:scale-105 shadow-lg ${buttonColors[accentColor]}`}
                            >
                              Enroll Now
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 md:p-3 rounded-full bg-black/40 hover:bg-black/60 transition-all backdrop-blur-md border border-white/20"
                aria-label="Previous slide"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 md:p-3 rounded-full bg-black/40 hover:bg-black/60 transition-all backdrop-blur-md border border-white/20"
                aria-label="Next slide"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2.5 mt-5">
            {trendingItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "bg-white w-8 h-2"
                    : "bg-white/40 w-2 h-2 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}