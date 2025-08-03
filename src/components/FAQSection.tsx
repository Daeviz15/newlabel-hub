import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      id: "item-1",
      question: "What is Newlabel TV?",
      answer: "Newlabel TV is your comprehensive entertainment platform that brings together exclusive video courses through Jsity and engaging podcast content from The House Chronicles, all in one convenient location."
    },
    {
      id: "item-2",
      question: "Can I download courses and watch them offline?",
      answer: "Yes, you can download courses for offline viewing. This feature is available for premium subscribers and allows you to learn anywhere, even without an internet connection."
    },
    {
      id: "item-3",
      question: "Can I stream any course with others?",
      answer: "Absolutely! We offer group streaming features that allow you to share learning experiences with friends, colleagues, or study groups. Perfect for collaborative learning."
    },
    {
      id: "item-4",
      question: "What if I forget my password?",
      answer: "No worries! Simply click on the 'Forgot Password' link on the login page, enter your email address, and we'll send you instructions to reset your password securely."
    }
  ];

  return (
    <section className="w-full bg-background py-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-card-foreground hover:no-underline hover:bg-secondary/50">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;