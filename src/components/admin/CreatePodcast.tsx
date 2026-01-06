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
import { Plus, Save, Mic2, User, Settings, Image, Video, Disc } from "lucide-react";
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
import { EpisodeForm } from "./EpisodeForm";
import { AdminLayout } from "./AdminLayout";
import { BrandedSpinner } from "@/components/ui/BrandedSpinner";

const podcastSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive").optional(),
  instructor: z.string().min(2, "Host name is required"),
  instructor_role: z.string().min(2, "Host role is required"), // e.g. "Main Host"
  level: z.string().min(1, "Genre is required"),
  duration: z.string().min(1, "Avg Duration is required"),
  brand: z.string().min(1, "Brand is required"),
});

type PodcastFormData = z.infer<typeof podcastSchema>;

interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoFile: File | null;
  order_number: number;
}

export const CreatePodcast = ({
  brand = "thc",
}: {
  brand?: "jsity" | "thc";
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [previewVideoFile, setPreviewVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([
    {
      title: "",
      description: "",
      duration: "",
      videoFile: null,
      order_number: 1,
      id: `episode-${Date.now()}`,
    },
  ]);

  const form = useForm<PodcastFormData>({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      instructor: "",
      instructor_role: "Host",
      level: "Entertainment",
      duration: "",
      brand: brand,
    },
  });

  const addEpisode = () => {
    setEpisodes([
      ...episodes,
      {
        title: "",
        description: "",
        duration: "",
        videoFile: null,
        order_number: episodes.length + 1,
        id: `episode-${Date.now()}`,
      },
    ]);
  };

  const removeEpisode = (episodeId: string) => {
    setEpisodes(episodes.filter((episode) => episode.id !== episodeId));
  };

  const updateEpisode = (episodeId: string, field: string, value: string | number) => {
    const updatedEpisodes = episodes.map((episode) =>
      episode.id === episodeId ? { ...episode, [field]: value } : episode
    );
    setEpisodes(updatedEpisodes);
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

      return publicUrl;
    } catch (error) {
      console.error(`[v0] Upload failed after timeout or error:`, error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const onSubmit = async (data: PodcastFormData) => {
    setLoading(true);
    try {
      console.log("[v0] Starting podcast creation...");

      const invalidEpisodes = episodes.filter(
        (e) => !e.videoFile || !e.title || !e.duration
      );
      if (invalidEpisodes.length > 0) {
        toast({
          title: "Validation Error",
          description:
            "All episodes must have a title, duration, and video/audio file",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      let previewVideoUrl = null;
      if (previewVideoFile) {
        try {
          const previewPath = `previews/${Date.now()}-${previewVideoFile.name}`;
          previewVideoUrl = await uploadFile(
            previewVideoFile,
            "course-videos",
            previewPath
          );
        } catch (error) {
          toast({
            title: "Upload Error",
            description: "Failed to upload trailer video.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      let imageUrl = null;
      if (imageFile) {
        try {
          const imagePath = `courses/${Date.now()}-${imageFile.name}`;
          imageUrl = await uploadFile(imageFile, "course-images", imagePath);
        } catch (error) {
          toast({
            title: "Upload Error",
            description: "Failed to upload podcast cover.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      const { data: podcast, error: podcastError } = await supabase
        .from("products")
        .insert([
          {
            title: data.title,
            description: data.description,
            price: data.price ?? 0,
            instructor: data.instructor,
            instructor_role: data.instructor_role,
            level: data.level,
            duration: data.duration,
            category: "podcast", // Explicitly set category to podcast
            image_url: imageUrl,
            preview_video_url: previewVideoUrl,
            brand: data.brand,
          },
        ])
        .select()
        .single();

      if (podcastError) {
        throw new Error(podcastError.message);
      }

      let successfulEpisodes = 0;
      for (let i = 0; i < episodes.length; i++) {
        const episode = episodes[i];
        if (!episode.videoFile) continue;

        try {
          const videoPath = `lessons/${podcast.id}/${Date.now()}-${i}-${
            episode.videoFile.name
          }`;
          const videoUrl = await uploadFile(
            episode.videoFile,
            "course-videos",
            videoPath
          );

          const { error: episodeError } = await supabase
            .from("course_lessons")
            .insert({
              course_id: podcast.id,
              title: episode.title,
              description: episode.description,
              duration: episode.duration,
              video_url: videoUrl,
              order_number: episode.order_number,
            });

          if (episodeError) throw episodeError;
          successfulEpisodes++;
        } catch (error: any) {
          console.error(`[v0] Episode ${i + 1} failed:`, error.message);
          toast({
            title: "Episode Upload Error",
            description: `Episode "${episode.title}" failed: ${error.message}`,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      toast({
        title: "Success!",
        description: `Podcast created with ${successfulEpisodes} episodes`,
      });

      form.reset();
      setPreviewVideoFile(null);
      setImageFile(null);
      setEpisodes([
        {
          title: "",
          description: "",
          duration: "",
          videoFile: null,
          order_number: 1,
          id: `episode-${Date.now()}`,
        },
      ]);
    } catch (error: any) {
      console.error("[v0] Error:", error);
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
              <Mic2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Create New Podcast Series (THC)</h1>
              <p className="text-zinc-400 text-sm">Fill in the details to publish a new podcast series</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Podcast Details Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
                <Settings className="w-5 h-5 text-purple-400" />
                <h2 className="font-semibold text-white">Series Details</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Series Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Tech Talk Daily"
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
                        <FormLabel className="text-zinc-300">Price (₦) - Optional</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-white placeholder:text-zinc-500"
                            {...field}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? undefined : Number.parseFloat(val));
                            }}
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
                        <FormLabel className="text-zinc-300">Genre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Technology, Lifestyle, Comedy"
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
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Avg. Duration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 45 mins per episode"
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
                      <FormLabel className="text-zinc-300">Series Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What is this podcast series about?"
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

            {/* Host Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
                <User className="w-5 h-5 text-purple-400" />
                <h2 className="font-semibold text-white">Host Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Host Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jane Doe"
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
                        <FormLabel className="text-zinc-300">Role</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Host / Creator"
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
                <h2 className="font-semibold text-white">Podcast Media</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Cover Art</label>
                    <ImageUpload onFileSelect={setImageFile} currentFile={imageFile} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Series Trailer (Optional)</label>
                    <VideoUpload
                      label=""
                      onFileSelect={setPreviewVideoFile}
                      currentFile={previewVideoFile}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Episodes Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Disc className="w-5 h-5 text-purple-400" />
                  <h2 className="font-semibold text-white">Episodes</h2>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">
                    {episodes.length} {episodes.length === 1 ? 'episode' : 'episodes'}
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={addEpisode}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Episode
                </Button>
              </div>
              <div className="p-6 space-y-4">
                {episodes.map((episode, index) => (
                  <EpisodeForm
                    key={episode.id}
                    episode={episode}
                    index={index}
                    onUpdate={(field, value) =>
                      updateEpisode(episode.id, field, value)
                    }
                    onRemove={() => removeEpisode(episode.id)}
                    showRemove={episodes.length > 1}
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
                    <span>Creating Podcast...</span>
                  </div>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Create Podcast Series
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
