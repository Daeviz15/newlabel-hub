"use client";

import type React from "react";
import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { compressImage, formatFileSize } from "@/lib/image-compression";

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  currentFile: File | null;
  previewUrl?: string | null;
}

export const ImageUpload = ({
  onFileSelect,
  currentFile,
  previewUrl,
}: ImageUploadProps) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image file
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      setIsCompressing(true);
      setCompressionInfo(null);

      try {
        const originalSize = file.size;
        const compressedFile = await compressImage(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.8,
          format: "image/jpeg",
        });
        
        const savedBytes = originalSize - compressedFile.size;
        const savedPercent = Math.round((savedBytes / originalSize) * 100);
        
        setCompressionInfo(
          `Compressed: ${formatFileSize(originalSize)} → ${formatFileSize(compressedFile.size)} (${savedPercent}% saved)`
        );
        
        onFileSelect(compressedFile);
      } catch (error) {
        console.error("Compression failed, using original:", error);
        onFileSelect(file);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  return (
    <div>
      <Label className="mb-2 block">Course Thumbnail</Label>
      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
          disabled={isCompressing}
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer flex flex-col items-center gap-2 ${isCompressing ? "opacity-50" : ""}`}
        >
          {isCompressing ? (
            <>
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Compressing image...</p>
            </>
          ) : currentFile ? (
            <>
              <img
                src={URL.createObjectURL(currentFile)}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-lg"
              />
              <p className="text-sm font-medium">{currentFile.name}</p>
              {compressionInfo && (
                <p className="text-xs text-green-500">{compressionInfo}</p>
              )}
            </>
          ) : previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Current"
                className="h-32 w-32 object-cover rounded-lg"
              />
              <p className="text-sm text-muted-foreground">
                Click to change image
              </p>
            </>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload image
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP (auto-compressed)
              </p>
            </>
          )}
        </label>
      </div>
    </div>
  );
};
