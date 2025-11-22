"use client";

import { useState, useEffect } from "react";
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
  video_url?: string;
  order_number: number;
}

interface EditCourseProps {
  courseId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EditCourse = ({
  courseId,
  onSuccess,
  onCancel,
}: EditCourseProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Files
  const [previewVideoFile, setPreviewVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Existing URLs for preview
  const [existingPreviewUrl, setExistingPreviewUrl] = useState<string | null>(
    null
  );
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  // To track lessons that need to be deleted
  const [initialLessonIds, setInitialLessonIds] = useState<string[]>([]);

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
      brand: "jsity",
    },
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setFetching(true);

        // Fetch Course Details
        const { data: course, error: courseError } = await supabase
          .from("products")
          .select("*")
          .eq("id", courseId)
          .single();

        if (courseError) throw courseError;

        // Fetch Lessons
        const { data: fetchedLessons, error: lessonsError } = await supabase
          .from("course_lessons")
          .select("*")
          .eq("course_id", courseId)
          .order("order_number", { ascending: true });

        if (lessonsError) throw lessonsError;

        // Populate Form
        form.reset({
          title: course.title,
          description: course.description || "",
          price: course.price,
          instructor: course.instructor || "",
          instructor_role: course.instructor_role || "",
          level: course.level || "Beginner",
          duration: course.duration || "",
          brand: course.brand || "jsity",
        });

        // Set URLs
        setExistingImageUrl(course.image_url);
        setExistingPreviewUrl(course.preview_video_url);

        // Populate Lessons
        const formattedLessons: Lesson[] = (fetchedLessons || []).map((l) => ({
          id: l.id,
          title: l.title,
          description: l.description || "",
          duration: l.duration || "",
          videoFile: null,
          video_url: l.video_url,
          order_number: l.order_number,
        }));

        setLessons(formattedLessons);
        setInitialLessonIds(formattedLessons.map((l) => l.id));
      } catch (error: any) {
        console.error("Error fetching course:", error);
        toast({
          title: "Error",
          description: "Failed to load course details",
          variant: "destructive",
        });
        onCancel();
      } finally {
        setFetching(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, form, toast, onCancel]);

  const addLesson = () => {
    setLessons([
      ...lessons,
      {
        title: "",
        description: "",
        duration: "",
        videoFile: null,
        order_number: lessons.length + 1,
        id: `new-${Date.now()}`,
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
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    if (error) throw new Error(`Upload failed: ${error.message}`);

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
  };

  const onSubmit = async (data: CourseFormData) => {
    setLoading(true);
    try {
      // Validate Lessons
      const invalidLessons = lessons.filter(
        (l) => (!l.videoFile && !l.video_url) || !l.title || !l.duration
      );
      if (invalidLessons.length > 0) {
        toast({
          title: "Validation Error",
          description: "All lessons must have a title, duration, and video",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 1. Upload new main files if exists
      let previewVideoUrl = existingPreviewUrl;
      if (previewVideoFile) {
        const previewPath = `previews/${Date.now()}-${previewVideoFile.name}`;
        previewVideoUrl = await uploadFile(
          previewVideoFile,
          "course-videos",
          previewPath
        );
      }

      let imageUrl = existingImageUrl;
      if (imageFile) {
        const imagePath = `courses/${Date.now()}-${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, "course-images", imagePath);
      }

      // 2. Update Course Details
      const { error: courseError } = await supabase
        .from("products")
        .update({
          title: data.title,
          description: data.description,
          price: data.price,
          instructor: data.instructor,
          instructor_role: data.instructor_role,
          level: data.level,
          duration: data.duration,
          image_url: imageUrl,
          preview_video_url: previewVideoUrl,
          brand: data.brand,
        })
        .eq("id", courseId);

      if (courseError) throw courseError;

      // 3. Handle Lessons

      // 3a. Delete removed lessons
      const currentLessonIds = lessons.map((l) => l.id);
      const lessonsToDelete = initialLessonIds.filter(
        (id) => !currentLessonIds.includes(id)
      );

      if (lessonsToDelete.length > 0) {
        // Ideally we should delete files too, but keeping it simple for now or rely on cascade if setup
        const { error: deleteError } = await supabase
          .from("course_lessons")
          .delete()
          .in("id", lessonsToDelete);

        if (deleteError) throw deleteError;
      }

      // 3b. Upsert (Update or Insert) lessons
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        let videoUrl = lesson.video_url;

        // Upload new video if selected
        if (lesson.videoFile) {
          const videoPath = `lessons/${courseId}/${Date.now()}-${i}-${
            lesson.videoFile.name
          }`;
          videoUrl = await uploadFile(
            lesson.videoFile,
            "course-videos",
            videoPath
          );
        }

        if (!videoUrl) continue; // Should be caught by validation

        const lessonData = {
          course_id: courseId,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          video_url: videoUrl,
          order_number: i + 1, // Update order based on current index
        };

        if (lesson.id.startsWith("new-")) {
          // Insert new lesson
          const { error: insertError } = await supabase
            .from("course_lessons")
            .insert(lessonData);
          if (insertError) throw insertError;
        } else {
          // Update existing lesson
          const { error: updateError } = await supabase
            .from("course_lessons")
            .update(lessonData)
            .eq("id", lesson.id);
          if (updateError) throw updateError;
        }
      }

      toast({
        title: "Success!",
        description: "Course updated successfully",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update course",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-h-[80vh] overflow-y-auto p-1"
      >
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

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform Label</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="jsity">Jsity</SelectItem>
                    <SelectItem value="thc">THC</SelectItem>
                    <SelectItem value="gospeline">Gospeline</SelectItem>
                  </SelectContent>
                </Select>
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
          <ImageUpload
            onFileSelect={setImageFile}
            currentFile={imageFile}
            previewUrl={existingImageUrl}
          />
          <VideoUpload
            label="Preview Video (5 mins)"
            onFileSelect={setPreviewVideoFile}
            currentFile={previewVideoFile}
            previewUrl={existingPreviewUrl}
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

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
