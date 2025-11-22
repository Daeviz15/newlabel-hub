"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { VideoUpload } from "./VideoUpload"

interface Episode {
  id: string
  title: string
  description: string
  duration: string
  videoFile: File | null
  order_number: number
}

interface EpisodeFormProps {
  episode: Episode
  index: number
  onUpdate: (field: string, value: any) => void
  onRemove: () => void
  showRemove: boolean
}

export const EpisodeForm = ({ episode, index, onUpdate, onRemove, showRemove }: EpisodeFormProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-4">
        <h4 className="font-medium">Episode {index + 1}</h4>
        {showRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label>Episode Title</Label>
          <Input
            placeholder="e.g., The Beginning of Everything"
            value={episode.title}
            onChange={(e) => onUpdate("title", e.target.value)}
          />
        </div>

        <div>
          <Label>Duration</Label>
          <Input
            placeholder="e.g., 45 mins"
            value={episode.duration}
            onChange={(e) => onUpdate("duration", e.target.value)}
          />
        </div>

        <div>
          <Label>Description (Optional)</Label>
          <Textarea
            placeholder="Brief description of this episode..."
            value={episode.description}
            onChange={(e) => onUpdate("description", e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <VideoUpload
          label="Episode Video/Audio"
          onFileSelect={(file) => onUpdate("videoFile", file)}
          currentFile={episode.videoFile}
          id={`video-upload-episode-${episode.id}`}
        />
      </div>
    </Card>
  )
}
