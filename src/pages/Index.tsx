import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";
import PodcastSection from "@/components/PodcastSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FAQSection from "@/components/FAQSection";
import LandingFooter from "@/components/LandingFooter";
import HowItWorks from "@/components/how-it-works.tsx";
import Ecosystem from "@/components/ecosystem";
import PopularContent from "@/components/popular-content";
import WhyChooseUs from "@/components/why-choose-us";
import Newsletter from "@/components/newsletter";

const Index = () => {
  return (
    <div>
      <div className="min-h-screen mx-auto max-w-6xl bg-background">
        <Header />
        <HeroSection />
        <HowItWorks />
        <Ecosystem />
        <PopularContent />
        <WhyChooseUs />
        <FAQSection />
        <Newsletter />
      </div>
      <LandingFooter />
    </div>
  );
};

export default Index;
