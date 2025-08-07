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

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-background py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center bg-secondary rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img
                  src={one}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-white relative z-30"
                />
                <img
                  src={two}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-white relative z-20"
                />
                <img
                  src={three}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-white relative z-10"
                />
              </div>
              <span className="text-xs sm:text-sm text-[#C8F998]">
                Over 50,000 curious minds follow our content
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight font-poppins">
            Stream, Learn And Listen.
            <br />
            <span className="text-foreground">All In One Place</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 font-inter">
            Explore exclusive content from our growing collection of creators
            and storytellers
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-12 sm:mb-16 px-4">
            <Button
              onClick={() => navigate("/signup")}
              className="bg-[linear-gradient(180deg,_#70E002_0%,_#69DA02_24.46%,_#56CA01_59.82%,_#38B100_100%)] text-black font-semibold font-poppins px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto hover:opacity-90 transition flex items-center gap-2"
            >
              Explore Our Content
              <ArrowUpRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hero Image - Added padding to accommodate floating cards */}
        <div className="relative max-w-5xl mx-auto px-4">
          {/* Added extra padding container to prevent clipping */}
          <div className="relative px-8 py-8">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-muted">
              <img
                src={heroImage}
                alt="Woman learning on laptop"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Top Left Floating Card - Now positioned relative to the padded container */}
            <div className="absolute top-20 left-[-20px] backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-700/50 max-w-[280px] transform hover:scale-105 transition-transform duration-200 z-10">
              <div className="flex items-center space-x-3">
                <img src={topleft} alt="" className="w-full h-auto" />
              </div>
            </div>

            {/* Bottom Right Floating Card - Now positioned relative to the padded container */}
            <div className="absolute bottom-14 right-[-20px] backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-700/50 max-w-[280px] transform hover:scale-105 transition-transform duration-200 z-10">
              <div className="flex items-center space-x-3">
                <img src={bottomright} alt="" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;