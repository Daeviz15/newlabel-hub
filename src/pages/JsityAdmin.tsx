"use client";

import { useAdmin } from "@/hooks/use-admin";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CoursesList } from "@/components/admin/CoursesList";
import { CreateCourse } from "@/components/admin/CreateCourse";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PodcastList } from "@/components/admin/PodcastList";
import { CreatePodcast } from "@/components/admin/CreatePodcast";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

const JsityAdmin = () => {
  const { isAdmin, loading } = useAdmin();
  const [selectedBrand, setSelectedBrand] = useState<"jsity" | "thc">("jsity");

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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {selectedBrand === "jsity"
                ? "Jsity Admin Panel"
                : "THC Admin Panel"}
            </h1>
            <p className="text-muted-foreground">
              {selectedBrand === "jsity"
                ? "Manage courses, lessons, and educational content"
                : "Manage podcasts, series, and entertainment content"}
            </p>
          </div>

          <div className="w-full md:w-[200px]">
            <Select
              value={selectedBrand}
              onValueChange={(value: "jsity" | "thc") =>
                setSelectedBrand(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jsity">JSITY Admin</SelectItem>
                <SelectItem value="thc">THC Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="content">
              {selectedBrand === "jsity" ? "Courses" : "Podcasts"}
            </TabsTrigger>
            <TabsTrigger value="create">
              Create {selectedBrand === "jsity" ? "Course" : "Podcast"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedBrand === "jsity" ? "All Courses" : "All Podcasts"}
                </CardTitle>
                <CardDescription>
                  {selectedBrand === "jsity"
                    ? "Manage existing courses and their lessons"
                    : "Manage existing podcasts and their episodes"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedBrand === "jsity" ? <CoursesList /> : <PodcastList />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedBrand === "jsity"
                    ? "Create New Course"
                    : "Create New Podcast Series"}
                </CardTitle>
                <CardDescription>
                  {selectedBrand === "jsity"
                    ? "Add a new course with lessons and content"
                    : "Add a new podcast series with episodes"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedBrand === "jsity" ? (
                  <CreateCourse brand={selectedBrand} />
                ) : (
                  <CreatePodcast brand={selectedBrand} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JsityAdmin;
