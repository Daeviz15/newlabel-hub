"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditCourse } from "./EditCourse";
import { AdminLayout } from "./AdminLayout";
import { BrandedSpinner } from "@/components/ui/BrandedSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const CoursesList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    data: courses,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "course")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (courseId: string) => {
    try {
      // First, get the course details to find associated files
      const { data: course, error: courseError } = await supabase
        .from("products")
        .select("image_url, preview_video_url")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;

      // Get all lessons for this course
      const { data: lessons, error: lessonsError } = await supabase
        .from("course_lessons")
        .select("video_url")
        .eq("course_id", courseId);

      if (lessonsError) throw lessonsError;

      // Delete lesson videos from storage
      if (lessons && lessons.length > 0) {
        const videoFilePaths = lessons
          .map((lesson) => {
            const url = lesson.video_url;
            const match = url.match(/course-videos\/(.+)$/);
            return match ? match[1] : null;
          })
          .filter(Boolean) as string[];

        if (videoFilePaths.length > 0) {
          const { error: videoDeleteError } = await supabase.storage
            .from("course-videos")
            .remove(videoFilePaths);

          if (videoDeleteError)
            console.error("Error deleting videos:", videoDeleteError);
        }
      }

      // Delete course thumbnail from storage
      if (course?.image_url) {
        const imageMatch = course.image_url.match(/course-images\/(.+)$/);
        if (imageMatch) {
          const { error: imageDeleteError } = await supabase.storage
            .from("course-images")
            .remove([imageMatch[1]]);

          if (imageDeleteError)
            console.error("Error deleting thumbnail:", imageDeleteError);
        }
      }

      // Delete preview video from storage if exists
      if (course?.preview_video_url) {
        const previewMatch =
          course.preview_video_url.match(/course-videos\/(.+)$/);
        if (previewMatch) {
          const { error: previewDeleteError } = await supabase.storage
            .from("course-videos")
            .remove([previewMatch[1]]);

          if (previewDeleteError)
            console.error("Error deleting preview video:", previewDeleteError);
        }
      }

      // Delete course lessons from database
      const { error: deleteLessonsError } = await supabase
        .from("course_lessons")
        .delete()
        .eq("course_id", courseId);

      if (deleteLessonsError) throw deleteLessonsError;

      // Finally, delete the course itself
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course and all associated files deleted successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-20">
          <BrandedSpinner size="lg" message="Loading courses..." />
        </div>
      </AdminLayout>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center">
              <PlusCircle className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">No courses found</h3>
            <p className="text-zinc-400">Create your first course to get started!</p>
            <Button
              onClick={() => navigate("/admin/create-course")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Courses</h1>
            <p className="text-zinc-400 text-sm">Manage your course catalog</p>
          </div>
          <Button
            onClick={() => navigate("/admin/create-course")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Course
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.instructor || "N/A"}</TableCell>
                  <TableCell>₦{course.price.toLocaleString()}</TableCell>
                  <TableCell>{course.students || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(course.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{course.title}" and all
                              its lessons. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(course.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={!!editingId}
        onOpenChange={(open) => !open && setEditingId(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course details, lessons, and media.
            </DialogDescription>
          </DialogHeader>
          {editingId && (
            <EditCourse
              courseId={editingId}
              onSuccess={() => {
                setEditingId(null);
                refetch();
              }}
              onCancel={() => setEditingId(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
