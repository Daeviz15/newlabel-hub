import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-woman-laptop.jpg";

const HeroSection = () => {
  return (
    <section className="w-full bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center bg-secondary rounded-full px-4 py-2 mb-8">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
              </div>
              <span className="text-sm text-muted-foreground">
                Learn with industry professionals
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            Stream, Learn And Listen.
            <br />
            <span className="text-foreground">All In One Place</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your trusted home for courses and podcast within a vibrant community
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <Button className="bg-brand-green hover:bg-brand-green-hover text-background font-semibold px-8 py-3 text-lg">
              Get Started
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary px-8 py-3 text-lg">
              Learn more →
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-muted">
            <img
              src={heroImage}
              alt="Woman learning on laptop"
              className="w-full h-auto object-cover"
            />
            
            {/* Floating Cards */}
            <div className="absolute top-8 left-8 bg-card rounded-lg p-4 shadow-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-background" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">Course Completed!</p>
                  <p className="text-xs text-muted-foreground">Video-1 Introduction</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 right-8 bg-card rounded-lg p-4 shadow-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-background" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">95/4.5 rating scale!</p>
                  <p className="text-xs text-muted-foreground">Excellent</p>
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