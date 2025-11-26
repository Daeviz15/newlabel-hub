"use client";

import { MotionWrapper, StaggerContainer, StaggerItem } from "./motion-wrapper";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const features = [
    {
      icon: "/assets/crown.png",
      title: "Multi-Brand Ecosystem",
      description:
        "Access content from our 3 brands and enjoy a wide range of topics, from business to lifestyle and everything in between.",
    },
    {
      icon: "/assets/medal.png",
      title: "Tailored Experience",
      description:
        "Whether you're into tech, personal growth or just want to unwind, a tailored experience awaits you on our platform.",
    },
    {
      icon: "/assets/mask.png",
      title: "Culture-Driven",
      description:
        "We're a culture-driven company focused on building community, delivering value and having fun while doing it.",
    },
    {
      icon: "/assets/flash.png",
      title: "Quality-First Content",
      description:
        "Every piece of content on our platform is carefully curated and vetted to ensure you get the best experience possible.",
    },
  ];

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <MotionWrapper variant="fadeUp">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2 font-vietnam">Why Choose Us?</h2>
          <p className="text-gray-400 font-vietnam">
            Our commitment to excellence has led us to achieve significant
            milestones along our journey. Here are some of our notable
            achievements
          </p>
        </div>
      </MotionWrapper>

      <StaggerContainer delay={0.1}>
        <div className="grid grif-col md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <StaggerItem key={index} variant="scale">
              <motion.div
                className="flex flex-col items-start justify-start gap-3 bg-[#1F1F1F] rounded-lg px-10 py-6"
                initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 15px 35px rgba(223, 254, 186, 0.15)",
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className="w-12 h-12 bg-[#DFFEBA] rounded-lg flex items-center justify-center mb-4 text-black text-xl flex-shrink-0"
                  initial={{ opacity: 0, rotate: -180, scale: 0 }}
                  whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                >
                  <img src={feature.icon} width={20} alt="icons" />
                </motion.div>

                <motion.h3
                  className="text-xl font-semibold mb-3 font-vietnam"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p
                  className="text-gray-400 leading-relaxed font-vietnam"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  );
}
