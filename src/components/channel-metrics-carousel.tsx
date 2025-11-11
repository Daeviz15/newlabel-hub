import { useState, useEffect, useRef } from "react";

interface TrendingItem {
  id: number;
  price: string;
  title: string;
  subtitle: string;
  image: string;
}

export default function ITunesCarousel() {
  const trendingItems: TrendingItem[] = [
    {
      id: 1,
      price: "$29.99",
      title: "Master AI Skills Today",
      subtitle: "Expert-led Learning",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&h=600&fit=crop&q=80",
    },
    {
      id: 2,
      price: "$34.99",
      title: "Leadership Excellence",
      subtitle: "Transform Your Career",
      image:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1920&h=600&fit=crop&q=80",
    },
    {
      id: 3,
      price: "$24.99",
      title: "Digital Marketing Pro",
      subtitle: "Grow Your Business",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1920&h=600&fit=crop&q=80",
    },
    {
      id: 4,
      price: "$27.99",
      title: "Creative Design Studio",
      subtitle: "Unleash Your Potential",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&h=600&fit=crop&q=80",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingItems.length);
    }, 4000);

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

  return (
    <section className=" min-h-screen flex items-center justify-center p-0">
      <div className="w-full px-0">
        <div className="relative">
          {/* Main carousel container */}
          <div className="relative overflow-hidden bg-neutral-900">
            {/* Carousel track */}
            <div className="relative w-full h-[400px]">
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

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                      <div className="space-y-3 max-w-2xl">
                        {/* Badge */}
                        <div className="inline-flex">
                          <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white/90 border border-white/10">
                            Featured
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-5xl font-semibold text-white leading-tight">
                          {item.title}
                        </h2>

                        {/* Subtitle */}
                        <p className="text-base md:text-lg text-white/60">
                          {item.subtitle}
                        </p>

                        {/* Price and CTA */}
                        <div className="flex items-center gap-4 pt-2">
                          <span className="text-2xl font-semibold text-white">
                            {item.price}
                          </span>
                          <button className="px-6 py-2.5 bg-white text-black rounded-lg font-medium text-sm hover:bg-white/90 transition-colors">
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all backdrop-blur-sm"
                aria-label="Next slide"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {trendingItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "bg-white w-6 h-1.5"
                    : "bg-white/30 w-1.5 h-1.5 hover:bg-white/50"
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