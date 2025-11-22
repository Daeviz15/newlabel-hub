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
import { EpisodeForm } from "./EpisodeForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const podcastSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  instructor: z.string().min(2, "Host name is required"),
  instructor_role: z.string().min(2, "Host role is required"), // e.g. "Main Host"
  level: z.string().min(1, "Category/Genre is required"), // Reusing 'level' for Genre
  duration: z.string().min(1, "Total Duration is required"),
  brand: z.string().min(1, "Brand is required"),
});

type PodcastFormData = z.infer<typeof podcastSchema>;

interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoFile: File | null;
  video_url?: string;
  order_number: number;
}

interface EditPodcastProps {
  podcastId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EditPodcast = ({
  podcastId,
  onSuccess,
  onCancel,
}: EditPodcastProps) => {
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

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  // To track episodes that need to be deleted
  const [initialEpisodeIds, setInitialEpisodeIds] = useState<string[]>([]);

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
      brand: "jsity",
    },
  });

  useEffect(() => {
    const fetchPodcastData = async () => {
      try {
        setFetching(true);

        // Fetch Podcast Details
        const { data: podcast, error: podcastError } = await supabase
          .from("products")
          .select("*")
          .eq("id", podcastId)
          .single();

        if (podcastError) throw podcastError;

        // Fetch Episodes
        const { data: fetchedEpisodes, error: episodesError } = await supabase
          .from("course_lessons")
          .select("*")
          .eq("course_id", podcastId)
          .order("order_number", { ascending: true });

        if (episodesError) throw episodesError;

        // Populate Form
        form.reset({
          title: podcast.title,
          description: podcast.description || "",
          price: podcast.price,
          instructor: podcast.instructor || "",
          instructor_role: podcast.instructor_role || "Host",
          level: podcast.level || "Entertainment",
          duration: podcast.duration || "",
          brand: podcast.brand || "jsity",
        });

        // Set URLs
        setExistingImageUrl(podcast.image_url);
        setExistingPreviewUrl(podcast.preview_video_url);

        // Populate Episodes
        const formattedEpisodes: Episode[] = (fetchedEpisodes || []).map(
          (e) => ({
            id: e.id,
            title: e.title,
            description: e.description || "",
            duration: e.duration || "",
            videoFile: null,
            video_url: e.video_url,
            order_number: e.order_number,
          })
        );

        setEpisodes(formattedEpisodes);
        setInitialEpisodeIds(formattedEpisodes.map((e) => e.id));
      } catch (error: any) {
        console.error("Error fetching podcast:", error);
        toast({
          title: "Error",
          description: "Failed to load podcast details",
          variant: "destructive",
        });
        onCancel();
      } finally {
        setFetching(false);
      }
    };

    if (podcastId) {
      fetchPodcastData();
    }
  }, [podcastId, form, toast, onCancel]);

  const addEpisode = () => {
    setEpisodes([
      ...episodes,
      {
        title: "",
        description: "",
        duration: "",
        videoFile: null,
        order_number: episodes.length + 1,
        id: `new-${Date.now()}`,
      },
    ]);
  };

  const removeEpisode = (episodeId: string) => {
    setEpisodes(episodes.filter((episode) => episode.id !== episodeId));
  };

  const updateEpisode = (episodeId: string, field: string, value: any) => {
    const updatedEpisodes = episodes.map((episode) =>
      episode.id === episodeId ? { ...episode, [field]: value } : episode
    );
    setEpisodes(updatedEpisodes);
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

  const onSubmit = async (data: PodcastFormData) => {
    setLoading(true);
    try {
      // Validate Episodes
      const invalidEpisodes = episodes.filter(
        (e) => (!e.videoFile && !e.video_url) || !e.title || !e.duration
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

      // 2. Update Podcast Details
      const { error: podcastError } = await supabase
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
        .eq("id", podcastId);

      if (podcastError) throw podcastError;

      // 3. Handle Episodes

      // 3a. Delete removed episodes
      const currentEpisodeIds = episodes.map((e) => e.id);
      const episodesToDelete = initialEpisodeIds.filter(
        (id) => !currentEpisodeIds.includes(id)
      );

      if (episodesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("course_lessons")
          .delete()
          .in("id", episodesToDelete);

        if (deleteError) throw deleteError;
      }

      // 3b. Upsert episodes
      for (let i = 0; i < episodes.length; i++) {
        const episode = episodes[i];
        let videoUrl = episode.video_url;

        // Upload new video if selected
        if (episode.videoFile) {
          const videoPath = `lessons/${podcastId}/${Date.now()}-${i}-${
            episode.videoFile.name
          }`;
          videoUrl = await uploadFile(
            episode.videoFile,
            "course-videos",
            videoPath
          );
        }

        if (!videoUrl) continue;

        const episodeData = {
          course_id: podcastId,
          title: episode.title,
          description: episode.description,
          duration: episode.duration,
          video_url: videoUrl,
          order_number: i + 1,
        };

        if (episode.id.startsWith("new-")) {
          // Insert new episode
          const { error: insertError } = await supabase
            .from("course_lessons")
            .insert(episodeData);
          if (insertError) throw insertError;
        } else {
          // Update existing episode
          const { error: updateError } = await supabase
            .from("course_lessons")
            .update(episodeData)
            .eq("id", episode.id);
          if (updateError) throw updateError;
        }
      }

      toast({
        title: "Success!",
        description: "Podcast updated successfully",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update podcast",
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
                <FormLabel>Podcast Series Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Tech Talk Daily" {...field} />
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
                <FormLabel>Price (₦) - Optional</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
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
                <FormLabel>Host Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
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
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Host / Creator" {...field} />
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
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Technology, Lifestyle, Comedy"
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
                <FormLabel>Avg. Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 45 mins per episode" {...field} />
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
              <FormLabel>Series Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What is this podcast series about?"
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
            label="Series Trailer (Optional)"
            onFileSelect={setPreviewVideoFile}
            currentFile={previewVideoFile}
            previewUrl={existingPreviewUrl}
          />
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Episodes</h3>
            <Button
              type="button"
              onClick={addEpisode}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Episode
            </Button>
          </div>

          <div className="space-y-4">
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
