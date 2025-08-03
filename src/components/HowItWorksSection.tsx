const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      title: "Create an account",
      description: "Get all of the latest with our active community and different activities on it",
      icon: (
        <div className="w-16 h-16 bg-brand-green rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )
    },
    {
      id: 2,
      title: "Discover your space",
      description: "The next big move of your career starts here. Find and enroll in the course from our library list",
      icon: (
        <div className="w-16 h-16 bg-brand-green rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      )
    },
    {
      id: 3,
      title: "Watch, learn or listen",
      description: "Stream content from our learning, listen to our podcast as you work and complete assignments on tracks",
      icon: (
        <div className="w-16 h-16 bg-brand-green rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
    }
  ];

  return (
    <section className="w-full bg-background py-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-xl text-muted-foreground">
            Our design will look through 3 easy steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={step.id} className="text-center relative">
              {/* Step Number */}
              <div className="text-6xl font-bold text-muted mb-4">
                0{step.id}
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-px bg-border transform translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;