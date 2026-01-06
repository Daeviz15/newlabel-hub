"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/course-card";
import { MotionWrapper, StaggerContainer, StaggerItem } from "./motion-wrapper";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface PopularProduct {
  id: string;
  image: string;
  price: string;
  title: string;
  subtitle: string;
}

export default function PopularContent() {
  const navigate = useNavigate();
  const [content, setContent] = useState<PopularProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularContent = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, title, price, image_url, instructor, brand")
          .order("created_at", { ascending: false })
          .limit(4);

        if (!error && data) {
          setContent(
            data.map((product) => ({
              id: product.id,
              image: product.image_url || "/assets/dashboard-images/face.jpg",
              price: `₦${product.price.toLocaleString()}`,
              title: product.title,
              subtitle: product.instructor || product.brand || "NewLabel",
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching popular content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularContent();
  }, []);

  const handleCardClick = (item: PopularProduct) => {
    navigate("/video-details", {
      state: {
        id: item.id,
        image: item.image,
        title: item.title,
        creator: item.subtitle,
        price: item.price,
      },
    });
  };

  // Fallback content if no products in database
  const fallbackContent: PopularProduct[] = [
    {
      id: "1",
      image: "/assets/dashboard-images/face.jpg",
      price: "₦15,000",
      title: "The Future Of AI In Everyday Products",
      subtitle: "Jsity",
    },
    {
      id: "2",
      image: "/assets/gospel.png",
      price: "₦12,000",
      title: "Firm Foundation",
      subtitle: "Gospelline",
    },
    {
      id: "3",
      image: "/assets/dashboard-images/lady.jpg",
      price: "₦10,000",
      title: "The Silent Trauma Of Millennials",
      subtitle: "The House Chronicles",
    },
    {
      id: "4",
      image: "/assets/dashboard-images/only.jpg",
      price: "₦18,000",
      title: "Building Your First Startup",
      subtitle: "Jsity",
    },
  ];

  const displayContent = content.length > 0 ? content : fallbackContent;

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <MotionWrapper variant="fadeUp">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2 font-poppins">
            What's Popular Right Now
          </h2>
          <p className="text-gray-400 font-inter">No subscriptions, No hassle</p>
        </div>
      </MotionWrapper>

      {/* Loading State */}
      {loading && (
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/5] w-full rounded-xl bg-neutral-800" />
              <Skeleton className="h-4 w-3/4 bg-neutral-800" />
              <Skeleton className="h-3 w-1/2 bg-neutral-800" />
            </div>
          ))}
        </div>
      )}

      {/* Desktop Grid View */}
      {!loading && (
        <StaggerContainer delay={0.12}>
          <div className="hidden md:grid md:grid-cols-4 gap-6">
            {displayContent.map((item, index) => (
              <StaggerItem key={item.id} variant="scale">
                <motion.div
                  initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <ProductCard
                    imageSrc={item.image}
                    title={item.title}
                    subtitle={item.subtitle}
                    price={item.price}
                    className="hover:ring-0 hover:ring-transparent cursor-pointer"
                    onClick={() => handleCardClick(item)}
                  />
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      )}

      {/* Mobile Carousel View */}
      {!loading && (
        <MotionWrapper variant="fadeIn" delay={0.2}>
          <div className="md:hidden">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {displayContent.map((item, index) => (
                  <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-4/5 sm:basis-3/5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <ProductCard
                        imageSrc={item.image}
                        title={item.title}
                        subtitle={item.subtitle}
                        price={item.price}
                        className="hover:ring-0 hover:ring-transparent cursor-pointer"
                        onClick={() => handleCardClick(item)}
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4" />
              <CarouselNext className="hidden sm:flex -right-4" />
            </Carousel>
          </div>
        </MotionWrapper>
      )}
    </section>
  );
}
