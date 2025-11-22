"use client";

import type React from "react";

import { ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image file
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      onFileSelect(file);
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
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          {currentFile ? (
            <>
              <img
                src={URL.createObjectURL(currentFile) || "/placeholder.svg"}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-lg"
              />
              <p className="text-sm font-medium">{currentFile.name}</p>
            </>
          ) : previewUrl ? (
            <>
              <img
                src={previewUrl || "/placeholder.svg"}
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
                PNG, JPG, WEBP (max 5MB)
              </p>
            </>
          )}
        </label>
      </div>
    </div>
  );
};
