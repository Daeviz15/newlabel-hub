import { Upload, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VideoUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  currentFile: File | null;
}

export const VideoUpload = ({ label, onFileSelect, currentFile }: VideoUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate video file
      if (!file.type.startsWith("video/")) {
        alert("Please upload a video file");
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id={`video-upload-${label}`}
        />
        <label
          htmlFor={`video-upload-${label}`}
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          {currentFile ? (
            <>
              <Video className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium">{currentFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(currentFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload video
              </p>
              <p className="text-xs text-muted-foreground">MP4, MOV, AVI (max 500MB)</p>
            </>
          )}
        </label>
      </div>
    </div>
  );
};
