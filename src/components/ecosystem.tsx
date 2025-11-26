"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { MotionWrapper, StaggerContainer, StaggerItem } from "./motion-wrapper";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Ecosystem() {
  const platforms = [
    {
      name: "Jsity",
      logoType: null,
      logoSrc: "/assets/jsity.png", // Fixed: removed /public/ - Next.js serves from public/ automatically
      description: "Learn from industry experts and enhance your skills",
      logoColor: "text-purple-400",
    },
    {
      name: "GOSPELLINE",
      logoType: null,
      logoSrc: "/assets/gospel.png", // Fixed: removed /public/
      description: "Learn from industry experts and enhance your skills",
      logoColor: "text-blue-400",
    },
    {
      name: "The House Chronicles",
      subtitle: "thC",
      logoSrc: null, // Changed from empty string to null so it's falsy
      description: "Learn from industry experts and enhance your skills",
      logoColor: "text-green-400",
    },
  ];
  const navigate = useNavigate(); 
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <MotionWrapper variant="fadeUp">
        <div className="mb-12">
          <h2  className="text-4xl font-bold mb-2 font-vietnam">
            Explore Our Ecosystem
          </h2>
          <p className="text-gray-400 font-inter">No subscriptions. No hassle</p>
        </div>
      </MotionWrapper>

      <div className="grid md:grid-cols-3 gap-6">
        {platforms.map((platform, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={index}
              className="bg-[#1F1F1F] rounded-2xl px-8 py-12 gap-5 h-[400px] flex flex-col items-start"
              initial={{
                opacity: 0,
                x: isEven ? -100 : 100,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
              }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                type: "spring",
                stiffness: 80,
              }}
              whileHover={{
                scale: 1.03,
                y: -8,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
                transition: { duration: 0.3 },
              }}
            >
              {/* Display logo image if available, otherwise show platform name */}
              {platform.logoSrc ? (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                >
                  {platform.subtitle && (
                    <h3
                      className={`text-sm font-medium ${platform.logoColor} mb-2`}
                    >
                      {platform.subtitle}
                    </h3>
                  )}
                  <motion.img
                    src={platform.logoSrc}
                    alt={`${platform.name} logo`}
                    className="max-h-16 w-auto object-contain"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                >
                  {platform.subtitle && (
                    <div
                      className={`text-lg font-medium ${platform.logoColor} mb-1`}
                    >
                      {platform.subtitle}
                    </div>
                  )}
                  <div className={`text-2xl font-bold text-white`}>
                    {platform.name}
                  </div>
                </motion.div>
              )}

              <motion.div
                className="flex-grow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
              >
                <p className="text-white text-lg leading-relaxed mb-8 font-vietnam">
                  {platform.description}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full border-[#E1FDC5] border-[1.67px] border-solid text-[#E1FDC5] hover:bg-brand-green rounded-lg py-3 text-base font-medium" onClick={() => navigate("/login")}
                >
                  Explore <ArrowUpRightIcon />
                </Button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
