"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { VideoUpload } from "./VideoUpload";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoFile: File | null;
  video_url?: string;
  order_number: number;
}

interface LessonFormProps {
  lesson: Lesson;
  index: number;
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
  showRemove: boolean;
}

export const LessonForm = ({
  lesson,
  index,
  onUpdate,
  onRemove,
  showRemove,
}: LessonFormProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-4">
        <h4 className="font-medium">Lesson {index + 1}</h4>
        {showRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label>Lesson Title</Label>
          <Input
            placeholder="e.g., Introduction to React Hooks"
            value={lesson.title}
            onChange={(e) => onUpdate("title", e.target.value)}
          />
        </div>

        <div>
          <Label>Duration</Label>
          <Input
            placeholder="e.g., 15 mins"
            value={lesson.duration}
            onChange={(e) => onUpdate("duration", e.target.value)}
          />
        </div>

        <div>
          <Label>Description (Optional)</Label>
          <Textarea
            placeholder="Brief description of what this lesson covers..."
            value={lesson.description}
            onChange={(e) => onUpdate("description", e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <VideoUpload
          label="Lesson Video"
          onFileSelect={(file) => onUpdate("videoFile", file)}
          currentFile={lesson.videoFile}
          previewUrl={lesson.video_url}
          id={`video-upload-lesson-${lesson.id}`}
        />
      </div>
    </Card>
  );
};
