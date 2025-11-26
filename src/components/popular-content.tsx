"use client";

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

export default function PopularContent() {
  const content = [
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NewLabel%20cards-RwCTjHHDOoN5zkZrEtDhuABIVBmiHq.png",
      price: "$18",
      title: "The Future Of AI In Everyday Products",
      subtitle: "Jsity",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NewLabel%20cards%20%281%29-twaNwqHhV7wFjwFD5UuAL1JyM09Yhz.png",
      price: "$18",
      title: "Firm Foundation",
      subtitle: "Gospelline",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NewLabel%20cards%20%282%29-aoNzOtotGyY6wmcgyaAUn260H9UY3D.png",
      price: "$18",
      title: "The Silent Trauma Of Millennials",
      subtitle: "The House Chronicles",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NewLabel%20cards-RwCTjHHDOoN5zkZrEtDhuABIVBmiHq.png",
      price: "$18",
      title: "The Future Of AI In Everyday Products",
      subtitle: "Jsity",
    },
  ];

  return (
    <section id="popular" className="px-6 py-16 max-w-7xl mx-auto">
      <MotionWrapper variant="fadeUp">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2 font-poppins">
            What's Popular Right Now
          </h2>
          <p className="text-gray-400 font-inter">No subscriptions, No hassle</p>
        </div>
      </MotionWrapper>

      {/* Desktop Grid View */}
      <StaggerContainer delay={0.12}>
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {content.map((item, index) => (
            <StaggerItem key={index} variant="scale">
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
                  className="hover:ring-0 hover:ring-transparent"
                />
              </motion.div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      {/* Mobile Carousel View */}
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
              {content.map((item, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-4/5 sm:basis-3/5">
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
                      className="hover:ring-0 hover:ring-transparent"
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
    </section>
  );
}
