import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-woman-laptop.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-background py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center bg-secondary rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Learn with industry professionals
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            Stream, Learn And Listen.
            <br />
            <span className="text-foreground">All In One Place</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Your trusted home for courses and podcast within a vibrant community
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-12 sm:mb-16 px-4">
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-brand-green hover:bg-brand-green-hover text-background font-semibold px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
            >
              Get Started
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              variant="outline" 
              className="border-border text-foreground hover:bg-secondary px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
            >
              Learn more →
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-muted">
            <img
              src={heroImage}
              alt="Woman learning on laptop"
              className="w-full h-auto object-cover"
            />
            
            {/* Floating Cards - Hidden on mobile for cleaner look */}
            <div className="hidden sm:block absolute top-4 sm:top-8 left-4 sm:left-8 bg-card rounded-lg p-3 sm:p-4 shadow-lg border border-border max-w-[200px]">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-background" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-card-foreground truncate">Course Completed!</p>
                  <p className="text-xs text-muted-foreground truncate">Video-1 Introduction</p>
                </div>
              </div>
            </div>

            <div className="hidden sm:block absolute bottom-4 sm:bottom-8 right-4 sm:right-8 bg-card rounded-lg p-3 sm:p-4 shadow-lg border border-border max-w-[200px]">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-background" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-card-foreground truncate">95/4.5 rating scale!</p>
                  <p className="text-xs text-muted-foreground truncate">Excellent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;