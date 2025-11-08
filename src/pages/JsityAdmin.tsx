import { useAdmin } from "@/hooks/use-admin";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CoursesList } from "@/components/admin/CoursesList";
import { CreateCourse } from "@/components/admin/CreateCourse";

const JsityAdmin = () => {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Jsity Admin Panel</h1>
          <p className="text-muted-foreground">Manage courses, lessons, and content</p>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="create">Create Course</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Courses</CardTitle>
                <CardDescription>Manage existing courses and their lessons</CardDescription>
              </CardHeader>
              <CardContent>
                <CoursesList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Course</CardTitle>
                <CardDescription>Add a new course with lessons and content</CardDescription>
              </CardHeader>
              <CardContent>
                <CreateCourse />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JsityAdmin;
