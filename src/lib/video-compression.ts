const MAX_VIDEO_WIDTH = 1280;
const MAX_VIDEO_HEIGHT = 720;
const TARGET_BITRATE = 1_500_000; // 1.5 Mbps

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  targetBitrate?: number;
  onProgress?: (progress: number) => void;
}

interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  duration: number;
}

export async function compressVideo(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = MAX_VIDEO_WIDTH,
    maxHeight = MAX_VIDEO_HEIGHT,
    targetBitrate = TARGET_BITRATE,
    onProgress,
  } = options;

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    video.onloadedmetadata = async () => {
      let { videoWidth, videoHeight } = video;
      const duration = video.duration;

      // Calculate new dimensions
      if (videoWidth > maxWidth || videoHeight > maxHeight) {
        const ratio = Math.min(maxWidth / videoWidth, maxHeight / videoHeight);
        videoWidth = Math.round(videoWidth * ratio);
        videoHeight = Math.round(videoHeight * ratio);
      }

      // Ensure even dimensions (required for some codecs)
      videoWidth = Math.floor(videoWidth / 2) * 2;
      videoHeight = Math.floor(videoHeight / 2) * 2;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      // Check if compression is needed
      const estimatedCompressedSize = (duration * targetBitrate) / 8;
      if (originalSize < estimatedCompressedSize * 1.2) {
        // Original is already small enough, return as-is
        console.log("Video already optimized, skipping compression");
        resolve({
          file,
          originalSize,
          compressedSize: originalSize,
          duration,
        });
        return;
      }

      try {
        // Use MediaRecorder to re-encode
        const stream = canvas.captureStream(30);
        
        // Try to use VP9 or VP8 codec, fall back to default
        let mimeType = "video/webm;codecs=vp9";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "video/webm;codecs=vp8";
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = "video/webm";
          }
        }

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: targetBitrate,
        });

        const chunks: Blob[] = [];
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".webm"),
            { type: "video/webm" }
          );

          console.log(
            `Video compressed: ${formatFileSize(originalSize)} → ${formatFileSize(compressedFile.size)} (${Math.round((1 - compressedFile.size / originalSize) * 100)}% reduction)`
          );

          resolve({
            file: compressedFile,
            originalSize,
            compressedSize: compressedFile.size,
            duration,
          });
        };

        mediaRecorder.onerror = (e) => {
          reject(new Error("MediaRecorder error"));
        };

        // Start recording and playback
        mediaRecorder.start(100);
        video.currentTime = 0;

        const drawFrame = () => {
          if (video.ended || video.paused) {
            mediaRecorder.stop();
            return;
          }

          ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
          
          if (onProgress && duration > 0) {
            onProgress(Math.min((video.currentTime / duration) * 100, 100));
          }

          requestAnimationFrame(drawFrame);
        };

        video.onended = () => {
          setTimeout(() => mediaRecorder.stop(), 100);
        };

        video.play().then(() => {
          drawFrame();
        }).catch(reject);

      } catch (error) {
        console.error("Compression failed:", error);
        // Return original file if compression fails
        resolve({
          file,
          originalSize,
          compressedSize: originalSize,
          duration,
        });
      }
    };

    video.onerror = () => reject(new Error("Failed to load video"));
    video.src = URL.createObjectURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}
