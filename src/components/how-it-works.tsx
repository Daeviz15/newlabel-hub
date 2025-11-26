"use client";

import { StaggerContainer, StaggerItem, MotionWrapper } from "./motion-wrapper";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      image: "/assets/create.png",
      title: "Create an account",
      description: "Sign up in seconds and unlock your personalized content.",
    },
    {
      image: "/assets/discover.png",
      title: "Discover your space",
      description:
        "Explore courses, podcasts and lots more tailored to your interests.",
    },
    {
      image: "/assets/watch.png",
      title: "Watch, learn or listen",
      description:
        "Stream on-demand content at your own pace - anytime, anywhere.",
    },
  ];

  return (
    <section id="how-it-works" className=" text-white px-6 py-16 max-w-7xl mx-auto">
      <MotionWrapper variant="fadeUp">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2 text-white font-vietnam">How It Works</h2>
          <p className="text-gray-400 font-inter">No subscriptions, No hassle</p>
        </div>
      </MotionWrapper>

      <StaggerContainer delay={0.15}>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <StaggerItem key={index} variant="scale">
              <motion.div
                className="text-left"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Image Container with Overlay Text */}
                <motion.div
                  className="bg-[#1a1a1a] rounded-2xl p-8 h-96 flex flex-col justify-between relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    boxShadow: "0 20px 40px rgba(112, 224, 2, 0.2)",
                    borderColor: "rgba(112, 224, 2, 0.3)",
                  }}
                >
                  {/* Image Section - Top 2/3 */}
                  <motion.div
                    className="flex-1 flex items-center justify-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  >
                    <img
                      src={step.image || "/placeholder.svg?height=200&width=300"}
                      alt={step.title}
                      className="max-w-full h-auto max-h-40 object-contain"
                      width={250}
                    />
                  </motion.div>
                  
                  {/* Text Content - Bottom 1/3 */}
                  <div className="space-y-3 relative z-10">
                    <motion.h3
                      className="text-xl font-semibold text-white font-inter"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      className="text-gray-400 leading-relaxed text-sm font-inter"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                    >
                      {step.description}
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  );
}


