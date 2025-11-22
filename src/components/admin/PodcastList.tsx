"use client"

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
} from "@/components/ui/alert-dialog"

export const PodcastList = () => {
  const { toast } = useToast()

  const {
    data: podcasts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-podcasts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "podcast") // Filter for podcasts
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  const handleDelete = async (podcastId: string) => {
    try {
      // First, get the podcast details to find associated files
      const { data: podcast, error: podcastError } = await supabase
        .from("products")
        .select("image_url, preview_video_url")
        .eq("id", podcastId)
        .single()

      if (podcastError) throw podcastError

      // Get all episodes for this podcast
      const { data: episodes, error: episodesError } = await supabase
        .from("course_lessons")
        .select("video_url")
        .eq("course_id", podcastId)

      if (episodesError) throw episodesError

      // Delete episode videos from storage
      if (episodes && episodes.length > 0) {
        const videoFilePaths = episodes
          .map((episode) => {
            const url = episode.video_url
            const match = url.match(/course-videos\/(.+)$/)
            return match ? match[1] : null
          })
          .filter(Boolean) as string[]

        if (videoFilePaths.length > 0) {
          const { error: videoDeleteError } = await supabase.storage.from("course-videos").remove(videoFilePaths)

          if (videoDeleteError) console.error("Error deleting videos:", videoDeleteError)
        }
      }

      // Delete podcast cover from storage
      if (podcast?.image_url) {
        const imageMatch = podcast.image_url.match(/course-images\/(.+)$/)
        if (imageMatch) {
          const { error: imageDeleteError } = await supabase.storage.from("course-images").remove([imageMatch[1]])

          if (imageDeleteError) console.error("Error deleting cover:", imageDeleteError)
        }
      }

      // Delete trailer from storage if exists
      if (podcast?.preview_video_url) {
        const previewMatch = podcast.preview_video_url.match(/course-videos\/(.+)$/)
        if (previewMatch) {
          const { error: previewDeleteError } = await supabase.storage.from("course-videos").remove([previewMatch[1]])

          if (previewDeleteError) console.error("Error deleting trailer:", previewDeleteError)
        }
      }

      // Delete episodes from database
      const { error: deleteEpisodesError } = await supabase.from("course_lessons").delete().eq("course_id", podcastId)

      if (deleteEpisodesError) throw deleteEpisodesError

      // Finally, delete the podcast itself
      const { error } = await supabase.from("products").delete().eq("id", podcastId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Podcast and all episodes deleted successfully",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete podcast",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!podcasts || podcasts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No podcasts found. Create your first podcast series to get started!</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Series Title</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {podcasts.map((podcast) => (
            <TableRow key={podcast.id}>
              <TableCell className="font-medium">{podcast.title}</TableCell>
              <TableCell>{podcast.instructor || "N/A"}</TableCell>
              <TableCell>{podcast.level || "N/A"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
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
                        <AlertDialogTitle>Delete Podcast?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{podcast.title}" and all its episodes. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(podcast.id)}>Delete</AlertDialogAction>
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
  )
}
