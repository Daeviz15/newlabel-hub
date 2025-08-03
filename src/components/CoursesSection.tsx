import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import instructor1 from "@/assets/instructor-1.jpg";
import instructor2 from "@/assets/instructor-2.jpg";
import instructor3 from "@/assets/instructor-3.jpg";

const CoursesSection = () => {
  const courses = [
    {
      id: 1,
      title: "RECLAIM YOUR FOCUS, BREAK MENTAL CLUTTER AND BUILD PRODUCTIVITY",
      instructor: "Jm Wayne",
      image: instructor1,
      rating: 4.9,
      students: "18.9k students",
      badge: "Best seller"
    },
    {
      id: 2,
      title: "RECLAIM YOUR FOCUS, BREAK MENTAL CLUTTER AND BUILD PRODUCTIVITY",
      instructor: "Jm Wayne",
      image: instructor2,
      rating: 4.9,
      students: "18.9k students",
      badge: "Best seller"
    },
    {
      id: 3,
      title: "RECLAIM YOUR FOCUS, BREAK MENTAL CLUTTER AND BUILD PRODUCTIVITY",
      instructor: "Jm Wayne",
      image: instructor3,
      rating: 4.9,
      students: "18.9k students",
      badge: "Best seller"
    }
  ];

  return (
    <section className="w-full bg-background py-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Ready To Level Up Your Skills With Exclusive Courses?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn, understand and apply. Getting a sound foundation and training from courses across different subjects.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => (
            <Card key={course.id} className="bg-card border-border hover:border-brand-green transition-colors group">
              <CardContent className="p-6">
                {/* Instructor Image */}
                <div className="mb-4">
                  <img
                    src={course.image}
                    alt={course.instructor}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Badge */}
                <Badge className="bg-brand-green text-background mb-3">
                  {course.badge}
                </Badge>

                {/* Course Title */}
                <h3 className="text-lg font-bold text-card-foreground mb-4 leading-tight">
                  {course.title}
                </h3>

                {/* Instructor */}
                <p className="text-sm text-muted-foreground mb-4">
                  By {course.instructor}
                </p>

                {/* Rating and Students */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-semibold text-card-foreground">
                        {course.rating}
                      </span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {course.students}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button className="bg-brand-green hover:bg-brand-green-hover text-background font-semibold px-8 py-3">
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;