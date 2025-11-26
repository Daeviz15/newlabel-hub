import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/frame.png";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import one from "/assets/one.png";
import two from "/assets/two.png";
import { Headphones, Package } from "lucide-react";
import three from "/assets/three.png";
import topleft from "/assets/topleft.png";
import bottomright from "/assets/bottomright.png";
import { motion } from "framer-motion";
import { MotionWrapper, StaggerContainer, StaggerItem } from "./motion-wrapper";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-background py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          {/* Badge */}
          <MotionWrapper variant="fadeUp" delay={0.2}>
            <StaggerContainer delay={0.1}>
              <div className="inline-flex items-center bg-secondary rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <StaggerItem variant="scale">
                      <motion.img
                        src={one}
                        alt=""
                        className="w-8 h-8 rounded-full border-2 border-white relative z-30"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                    </StaggerItem>
                    <StaggerItem variant="scale">
                      <motion.img
                        src={two}
                        alt=""
                        className="w-8 h-8 rounded-full border-2 border-white relative z-20"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                    </StaggerItem>
                    <StaggerItem variant="scale">
                      <motion.img
                        src={three}
                        alt=""
                        className="w-8 h-8 rounded-full border-2 border-white relative z-10"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                    </StaggerItem>
                  </div>
                  <span className="text-xs sm:text-sm text-[#C8F998]">
                    Over 50,000 curious minds follow our content
                  </span>
                </div>
              </div>
            </StaggerContainer>
          </MotionWrapper>

          {/* Main Headline */}
          <MotionWrapper variant="fadeUp" delay={0.4} duration={0.8}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight font-poppins">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Stream, Learn And Listen.
              </motion.span>
              <br />
              <motion.span
                className="text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                All In One Place
              </motion.span>
            </h1>
          </MotionWrapper>

          {/* Subheadline */}
          <MotionWrapper variant="fadeUp" delay={0.6}>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 font-inter">
              Explore exclusive content from our growing collection of creators
              and storytellers
            </p>
          </MotionWrapper>

          {/* CTA Buttons */}
          <MotionWrapper variant="scale" delay={0.8}>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-12 sm:mb-16 px-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate("/signup")}
                  className="bg-[linear-gradient(180deg,_#70E002_0%,_#69DA02_24.46%,_#56CA01_59.82%,_#38B100_100%)] text-black font-semibold font-poppins px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto hover:opacity-90 transition flex items-center gap-2"
                >
                  Explore Our Content
                  <ArrowUpRightIcon className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </MotionWrapper>
        </div>

        {/* Hero Image - Added padding to accommodate floating cards */}
        <MotionWrapper variant="fadeUp" delay={1.0} duration={0.8}>
          <div className="relative max-w-5xl mx-auto px-4">
            {/* Added extra padding container to prevent clipping */}
            <div className="relative px-8 py-8">
              <motion.div
                className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-muted"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <img
                  src={heroImage}
                  alt="Woman learning on laptop"
                  className="w-full h-auto object-cover"
                />
              </motion.div>

              {/* Top Left Floating Card - Now positioned relative to the padded container */}
              <motion.div
                className="absolute top-20 left-[-20px] backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-700/50 max-w-[280px] z-10"
                initial={{ opacity: 0, x: -50, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1.3,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center space-x-3">
                  <img src={topleft} alt="" className="w-full h-auto" />
                </div>
              </motion.div>

              {/* Bottom Right Floating Card - Now positioned relative to the padded container */}
              <motion.div
                className="absolute bottom-14 right-[-20px] backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-700/50 max-w-[280px] z-10"
                initial={{ opacity: 0, x: 50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1.5,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center space-x-3">
                  <img src={bottomright} alt="" className="w-full h-auto" />
                </div>
              </motion.div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
};

export default HeroSection;