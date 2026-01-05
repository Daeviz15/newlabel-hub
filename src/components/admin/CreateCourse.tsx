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
import { Plus, Save, BookOpen, User, Settings, Image, Video, GraduationCap } from "lucide-react";
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
import { AdminLayout } from "./AdminLayout";
import { BrandedSpinner } from "@/components/ui/BrandedSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  instructor: z.string().min(2, "Instructor name is required"),
  instructor_role: z.string().min(2, "Instructor role is required"),
  level: z.string().min(1, "Level is required"),
  duration: z.string().min(1, "Duration is required"),
  brand: z.string().min(1, "Brand is required"),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoFile: File | null;
  order_number: number;
  is_preview?: boolean;
}

export const CreateCourse = ({
  brand = "jsity",
}: {
  brand?: "jsity" | "thc";
}) => {
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
      is_preview: false,
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
      brand: brand,
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
        is_preview: false,
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
            brand: data.brand,
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
              is_preview: lesson.is_preview || false,
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
          is_preview: false,
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
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Create New Course (Jsity)</h1>
              <p className="text-zinc-400 text-sm">Fill in the details to publish a new course</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Course Details Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
                <Settings className="w-5 h-5 text-purple-400" />
                <h2 className="font-semibold text-white">Course Details</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Course Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Advanced React Development"
                            className="bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-white placeholder:text-zinc-500"
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
                        <FormLabel className="text-zinc-300">Price (₦)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10000"
                            className="bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-white placeholder:text-zinc-500"
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
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Level</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
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
                        <FormLabel className="text-zinc-300">Total Duration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 5 hours"
                            className="bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-white placeholder:text-zinc-500"
                            {...field}
                          />
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
                      <FormLabel className="text-zinc-300">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what students will learn..."
                          className="min-h-[120px] bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-white placeholder:text-zinc-500 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Instructor Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
                <User className="w-5 h-5 text-purple-400" />
                <h2 className="font-semibold text-white">Instructor Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Instructor Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-white placeholder:text-zinc-500"
                            {...field}
                          />
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
                        <FormLabel className="text-zinc-300">Instructor Role</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Senior Developer"
                            className="bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-white placeholder:text-zinc-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Media Upload Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
                <Image className="w-5 h-5 text-purple-400" />
                <h2 className="font-semibold text-white">Course Media</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Course Thumbnail</label>
                    <ImageUpload onFileSelect={setImageFile} currentFile={imageFile} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Preview Video (5 mins)</label>
                    <VideoUpload
                      label=""
                      onFileSelect={setPreviewVideoFile}
                      currentFile={previewVideoFile}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <h2 className="font-semibold text-white">Course Lessons</h2>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">
                    {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={addLesson}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </div>
              <div className="p-6 space-y-4">
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

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-base"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <BrandedSpinner size="sm" />
                    <span>Creating Course...</span>
                  </div>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Create Course
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};
