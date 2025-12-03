"use client";

import type React from "react";
import { useState } from "react";
import { Upload, Video, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { compressVideo, formatFileSize } from "@/lib/video-compression";

interface VideoUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  currentFile: File | null;
  id?: string;
  previewUrl?: string | null;
}

export const VideoUpload = ({
  label,
  onFileSelect,
  currentFile,
  id,
  previewUrl,
}: VideoUploadProps) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate video file
      if (!file.type.startsWith("video/")) {
        alert("Please upload a video file");
        return;
      }

      // Skip compression for small files (< 10MB)
      if (file.size < 10 * 1024 * 1024) {
        console.log("Video is small, skipping compression");
        setCompressionInfo(`Size: ${formatFileSize(file.size)}`);
        onFileSelect(file);
        return;
      }

      setIsCompressing(true);
      setCompressionProgress(0);
      setCompressionInfo(null);

      try {
        const result = await compressVideo(file, {
          maxWidth: 1280,
          maxHeight: 720,
          targetBitrate: 1_500_000,
          onProgress: setCompressionProgress,
        });

        const savedBytes = result.originalSize - result.compressedSize;
        const savedPercent = Math.round((savedBytes / result.originalSize) * 100);

        if (savedPercent > 5) {
          setCompressionInfo(
            `Compressed: ${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)} (${savedPercent}% saved)`
          );
        } else {
          setCompressionInfo(`Size: ${formatFileSize(result.compressedSize)}`);
        }

        onFileSelect(result.file);
      } catch (error) {
        console.error("Video compression failed:", error);
        setCompressionInfo(`Size: ${formatFileSize(file.size)}`);
        onFileSelect(file);
      } finally {
        setIsCompressing(false);
        setCompressionProgress(0);
      }
    }
  };

  const uniqueId = id || `video-upload-${label}`;

  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id={uniqueId}
          disabled={isCompressing}
        />
        <label
          htmlFor={uniqueId}
          className={`cursor-pointer flex flex-col items-center gap-2 ${isCompressing ? "opacity-50" : ""}`}
        >
          {isCompressing ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm font-medium">Compressing video...</p>
              <div className="w-full max-w-xs">
                <Progress value={compressionProgress} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(compressionProgress)}% complete
              </p>
            </>
          ) : currentFile ? (
            <>
              <Video className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium">{currentFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(currentFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {compressionInfo && (
                <p className="text-xs text-green-500">{compressionInfo}</p>
              )}
            </>
          ) : previewUrl ? (
            <>
              <Video className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium text-primary">
                Current Video Uploaded
              </p>
              <p className="text-xs text-muted-foreground break-all line-clamp-1 px-4">
                {previewUrl.split("/").pop()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Click to replace
              </p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload video
              </p>
              <p className="text-xs text-muted-foreground">
                MP4, MOV, AVI (auto-compressed for large files)
              </p>
            </>
          )}
        </label>
      </div>
    </div>
  );
};
