import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";
import PodcastSection from "@/components/PodcastSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FAQSection from "@/components/FAQSection";
import LandingFooter from "@/components/LandingFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CoursesSection />
      <PodcastSection />
      <HowItWorksSection />
      <FAQSection />
      <LandingFooter />
    </div>
  );
};

export default Index;
