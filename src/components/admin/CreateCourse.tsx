"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { VideoUpload } from "./VideoUpload";
import { ImageUpload } from "./ImageUpload";
import { LessonForm } from "./LessonForm";

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  instructor: z.string().min(2, "Instructor name is required"),
  instructor_role: z.string().min(2, "Instructor role is required"),
  level: z.string().min(1, "Level is required"),
  duration: z.string().min(1, "Duration is required"),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoFile: File | null;
  order_number: number;
}

export const CreateCourse = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [previewVideoFile, setPreviewVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      title: "",
      description: "",
      duration: "",
      videoFile: null,
      order_number: 1,
      id: `lesson-${Date.now()}`,
    },
  ]);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      instructor: "",
      instructor_role: "",
      level: "Beginner",
      duration: "",
    },
  });

  const addLesson = () => {
    setLessons([
      ...lessons,
      {
        title: "",
        description: "",
        duration: "",
        videoFile: null,
        order_number: lessons.length + 1,
        id: `lesson-${Date.now()}`,
      },
    ]);
  };

  const removeLesson = (lessonId: string) => {
    setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
  };

  const updateLesson = (lessonId: string, field: string, value: any) => {
    const updatedLessons = lessons.map((lesson) =>
      lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
    );
    setLessons(updatedLessons);
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (error) {
        console.error(`[v0] Upload error for ${file.name}:`, error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      console.log(`[v0] Successfully uploaded ${file.name}:`, publicUrl);
      return publicUrl;
    } catch (error) {
      console.error(`[v0] Upload failed after timeout or error:`, error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    setLoading(true);
    try {
      console.log("[v0] Starting course creation...");

      const invalidLessons = lessons.filter(
        (l) => !l.videoFile || !l.title || !l.duration
      );
      if (invalidLessons.length > 0) {
        console.error("[v0] Invalid lessons found:", invalidLessons);
        toast({
          title: "Validation Error",
          description: "All lessons must have a title, duration, and video",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("[v0] Validation passed. Total lessons:", lessons.length);

      let previewVideoUrl = null;
      if (previewVideoFile) {
        try {
          console.log("[v0] Uploading preview video...");
          const previewPath = `previews/${Date.now()}-${previewVideoFile.name}`;
          previewVideoUrl = await uploadFile(
            previewVideoFile,
            "course-videos",
            previewPath
          );
          console.log("[v0] Preview video uploaded successfully");
        } catch (error) {
          console.error("[v0] Preview video upload failed:", error);
          toast({
            title: "Upload Error",
            description: "Failed to upload preview video. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      let imageUrl = null;
      if (imageFile) {
        try {
          console.log("[v0] Uploading course image...");
          const imagePath = `courses/${Date.now()}-${imageFile.name}`;
          imageUrl = await uploadFile(imageFile, "course-images", imagePath);
          console.log("[v0] Course image uploaded successfully");
        } catch (error) {
          console.error("[v0] Course image upload failed:", error);
          toast({
            title: "Upload Error",
            description: "Failed to upload course image. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      console.log("[v0] All media uploaded. Creating course in database...");

      const { data: course, error: courseError } = await supabase
        .from("products")
        .insert([
          {
            title: data.title,
            description: data.description,
            price: data.price,
            instructor: data.instructor,
            instructor_role: data.instructor_role,
            level: data.level,
            duration: data.duration,
            category: "course",
            image_url: imageUrl,
            preview_video_url: previewVideoUrl,
          },
        ])
        .select()
        .single();

      if (courseError) {
        console.error(
          "[v0] Course creation failed:",
          courseError.message,
          courseError.details
        );
        toast({
          title: "Database Error",
          description:
            "Failed to create course. Please check your database permissions.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("[v0] Course created successfully. ID:", course.id);
      console.log(`[v0] Now uploading ${lessons.length} lesson videos...`);

      let successfulLessons = 0;
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        console.log(`[v0] Processing lesson ${i + 1}/${lessons.length}...`);

        if (!lesson.videoFile) {
          console.warn(`[v0] Lesson ${i + 1} has no video file, skipping`);
          continue;
        }

        try {
          console.log(`[v0] Uploading video for lesson "${lesson.title}"...`);
          const videoPath = `lessons/${course.id}/${Date.now()}-${i}-${
            lesson.videoFile.name
          }`;
          const videoUrl = await uploadFile(
            lesson.videoFile,
            "course-videos",
            videoPath
          );

          console.log(
            `[v0] Lesson ${i + 1} video uploaded. Inserting into database...`
          );

          const { error: lessonError } = await supabase
            .from("course_lessons")
            .insert({
              course_id: course.id,
              title: lesson.title,
              description: lesson.description,
              duration: lesson.duration,
              video_url: videoUrl,
              order_number: lesson.order_number,
            });

          if (lessonError) {
            console.error(
              `[v0] Lesson ${i + 1} database insert failed:`,
              lessonError.message
            );
            throw new Error(`Database error: ${lessonError.message}`);
          }

          successfulLessons++;
          console.log(
            `[v0] Lesson ${
              i + 1
            } completed successfully (${successfulLessons}/${lessons.length})`
          );
        } catch (error: any) {
          console.error(`[v0] Lesson ${i + 1} failed:`, error.message);
          toast({
            title: "Lesson Upload Error",
            description: `Lesson "${lesson.title}" failed: ${error.message}`,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      console.log(`[v0] All ${successfulLessons} lessons created successfully`);

      toast({
        title: "Success!",
        description: `Course created with ${successfulLessons} lessons`,
      });

      form.reset();
      setPreviewVideoFile(null);
      setImageFile(null);
      setLessons([
        {
          title: "",
          description: "",
          duration: "",
          videoFile: null,
          order_number: 1,
          id: `lesson-${Date.now()}`,
        },
      ]);
    } catch (error: any) {
      console.error("[v0] Unexpected error during course creation:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Advanced React Development"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₦)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10000"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number.parseFloat(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructor_role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor Role</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Beginner, Intermediate, Advanced"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 5 hours" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what students will learn..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUpload onFileSelect={setImageFile} currentFile={imageFile} />
          <VideoUpload
            label="Preview Video (5 mins)"
            onFileSelect={setPreviewVideoFile}
            currentFile={previewVideoFile}
          />
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Course Lessons</h3>
            <Button
              type="button"
              onClick={addLesson}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          </div>

          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <LessonForm
                key={lesson.id}
                lesson={lesson}
                index={index}
                onUpdate={(field, value) =>
                  updateLesson(lesson.id, field, value)
                }
                onRemove={() => removeLesson(lesson.id)}
                showRemove={lessons.length > 1}
              />
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Course...
            </>
          ) : (
            "Create Course"
          )}
        </Button>
      </form>
    </Form>
  );
};
