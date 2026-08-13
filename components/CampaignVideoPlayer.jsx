import React, { useRef, useState, useEffect } from "react";
import { CAMPAIGN_VIDEO } from "@/lib/media";
import { Volume2, VolumeX, Play, Pause, ExternalLink, RefreshCw } from "lucide-react";
import { useStoreSettings } from "@/lib/storeSettings";

export default function CampaignVideoPlayer({ aspectRatio = "aspect-[16/9]", className = "" }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [useIframe, setUseIframe] = useState(false);
  const { storeSettings } = useStoreSettings();

  const customVideoUrl = storeSettings?.campaignVideoUrl || storeSettings?.heroVideoUrl;
  const activeVideoSrc = customVideoUrl || CAMPAIGN_VIDEO.streamUrl || "/videos/campaign.mp4";
  const hasVideoSource = Boolean(activeVideoSrc || CAMPAIGN_VIDEO.embedUrl);

  // Guarantee loop playback
  const handleEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVideoError = () => {
    if (CAMPAIGN_VIDEO.embedUrl) {
      setUseIframe(true);
    }
  };

  if (!hasVideoSource) {
    return (
      <div className={`relative ${aspectRatio} w-full overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-black rounded-sm border border-neutral-900 flex flex-col items-center justify-center p-8 text-center select-none shadow-2xl ${className}`}>
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-neutral-600 mb-2">FORTIFIED BRAND</span>
        <h3 className="font-display text-xl sm:text-2xl font-black tracking-monolith text-white uppercase">CAMPAIGN FILM</h3>
        <div className="h-[1px] w-8 bg-neutral-800 my-4" />
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8A8A8A] border border-neutral-800 px-3 py-1 bg-neutral-950/50">
          FILM DELETED / ARCHIVED
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${aspectRatio} w-full overflow-hidden bg-black group rounded-sm border border-neutral-800 cinematic shadow-2xl ${className}`}>
      
      {/* IFRAME EMBED MODE (Google Drive Built-in Player) */}
      {useIframe ? (
        <iframe
          src={`${CAMPAIGN_VIDEO.embedUrl}?autoplay=1&loop=1&muted=1&mute=1`}
          className="absolute inset-0 h-full w-full border-0 object-cover scale-[1.01]"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title="FORTIFIED Campaign Video"
        />
      ) : (
        /* DIRECT HTML5 VIDEO MODE - FULL BOX COVER & CONTINUOUS LOOP */
        <video
          ref={videoRef}
          key={activeVideoSrc}
          src={activeVideoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onEnded={handleEnded}
          onError={handleVideoError}
          className="absolute inset-0 h-full w-full object-cover opacity-100 cursor-pointer"
          onClick={togglePlay}
        >
          Your browser does not support HTML5 video.
        </video>
      )}

      {/* Top Left Title Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="font-mono text-[9px] uppercase tracking-[0.25em] bg-black/70 px-3 py-1.5 text-white backdrop-blur-md border border-white/10 rounded-sm">
          Campaign Film · SS26
        </div>
      </div>

      {/* Top Right Actions (REC badge & Open Drive Link) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {CAMPAIGN_VIDEO.driveUrl && (
          <a
            href={CAMPAIGN_VIDEO.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] bg-black/70 hover:bg-white hover:text-black px-3 py-1.5 text-neutral-300 backdrop-blur-md border border-white/10 rounded-sm transition-all duration-200"
            title="Open in Google Drive"
          >
            <span>Drive</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] bg-black/70 px-3 py-1.5 text-red-500 backdrop-blur-md border border-white/10 rounded-sm">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span>REC</span>
        </div>
      </div>

      {/* Video Controls Overlay */}
      {!useIframe && (
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-black/70 hover:bg-white hover:text-black text-white backdrop-blur-md transition-all border border-white/20 cursor-pointer"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-black/70 hover:bg-white hover:text-black text-white backdrop-blur-md transition-all border border-white/20 cursor-pointer"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>

          <button
            onClick={() => setUseIframe((prev) => !prev)}
            className="font-mono text-[9px] uppercase tracking-wider bg-black/70 hover:bg-white hover:text-black text-neutral-300 px-3 py-2 rounded border border-white/10 backdrop-blur-md transition-all flex items-center gap-1.5"
            title="Switch player mode"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Switch Player</span>
          </button>
        </div>
      )}
    </div>
  );
}
