import { useState, useRef } from "react";
import { Play } from "lucide-react";

const VideoPreviewHover = ({
  posterImage,
  previewVideoUrl,
  onPlayClick,
  alt = "Course preview",
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // ADD THIS - Check what data we're receiving
  console.log("VideoPreviewHover props:", {
    posterImage,
    previewVideoUrl,
    hasVideo: !!previewVideoUrl,
  });

  const handleMouseEnter = () => {
    console.log("�mouse Mouse entered!"); // ADD THIS
    hoverTimeoutRef.current = setTimeout(() => {
      console.log("⏰ Timeout fired!"); // ADD THIS
      setIsHovering(true);
      if (videoRef.current && previewVideoUrl) {
        console.log("▶️ Trying to play video"); // ADD THIS
        videoRef.current.play().catch((err) => {
          console.log("❌ Auto-play prevented:", err);
        });
      } else {
        console.log("⚠️ No video ref or URL:", {
          // ADD THIS
          hasRef: !!videoRef.current,
          hasUrl: !!previewVideoUrl,
        });
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    console.log("👋 Mouse left!"); // ADD THIS
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoLoaded = () => {
    console.log("✅ Video loaded successfully!"); // ADD THIS
    setIsVideoLoaded(true);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden aspect-video group shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Poster Image */}
      <img
        src={posterImage}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isHovering && isVideoLoaded
            ? "opacity-0"
            : "opacity-100 group-hover:scale-105"
        }`}
      />

      {/* Preview Video */}
      {previewVideoUrl && (
        <video
          ref={videoRef}
          src={previewVideoUrl}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovering && isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
          muted
          loop
          playsInline
          onLoadedData={handleVideoLoaded}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      {/* Play Button */}
      <button
        onClick={onPlayClick}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center group-hover:bg-purple-700 transition-all group-hover:scale-110">
          <Play className="w-8 h-8 text-white fill-white ml-1" />
        </div>
      </button>
    </div>
  );
};

export default VideoPreviewHover;
