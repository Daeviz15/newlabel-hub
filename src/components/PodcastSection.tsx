import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import podcastImage from "@/assets/podcast-episode.jpg";

const PodcastSection = () => {
  const episodes = [
    {
      id: 1,
      title: "Ep 116: The Seven Towers Of Millionaires",
      description: "7 lessons discussed",
      image: podcastImage,
      isNew: true
    },
    {
      id: 2,
      title: "Ep 116: The Seven Towers Of Millionaires",
      description: "7 lessons discussed",
      image: podcastImage,
      isNew: true
    },
    {
      id: 3,
      title: "Ep 116: The Seven Towers Of Millionaires",
      description: "7 lessons discussed",
      image: podcastImage,
      isNew: true
    }
  ];

  return (
    <section className="w-full bg-background py-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            From Our Favorites to You
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A handpicked list of episodes we have lined up just for you this weekend
          </p>
        </div>

        {/* Episodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {episodes.map((episode) => (
            <Card key={episode.id} className="bg-card border-border hover:border-brand-green transition-colors group overflow-hidden">
              <CardContent className="p-0">
                {/* Episode Image */}
                <div className="relative">
                  <img
                    src={episode.image}
                    alt={episode.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-background ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>

                  {/* New Badge */}
                  {episode.isNew && (
                    <Badge className="absolute top-4 left-4 bg-brand-green text-background">
                      New
                    </Badge>
                  )}
                </div>

                {/* Episode Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-card-foreground mb-2 leading-tight">
                    {episode.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {episode.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button className="bg-brand-green hover:bg-brand-green-hover text-background font-semibold px-8 py-3">
            View All Episodes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;