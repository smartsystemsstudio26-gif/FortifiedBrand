import React, { useState } from "react";
import { Check, Upload, RefreshCw, Film, Image as ImageIcon, Sliders } from "lucide-react";
import SpinningLogo from "./SpinningLogo";
import { useStoreSettings } from "@/lib/storeSettings";

export default function BrandAssetsMediaManager() {
  const { storeSettings, updateStoreSettings } = useStoreSettings();

  // Local state for UI feedback
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoStatus, setLogoStatus] = useState("");

  const [heroUploading, setHeroUploading] = useState(false);
  const [heroStatus, setHeroStatus] = useState("");

  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoStatus, setVideoStatus] = useState("");

  // 1. Direct Image File Upload Handler (Uses chunking for larger files, with client fallback for Netlify)
  const handleMediaFileUpload = (file, folder, fileName, callback) => {
    if (file.size > 500 * 1024) {
      handleVideoChunkUpload(file, folder, fileName, () => {}, callback);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result;
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileData: dataUrl,
            fileName,
            folder,
          }),
        });
        if (!res.ok) throw new Error(`Server returned status ${res.status}`);
        const data = await res.json();
        if (data.success && data.url) {
          callback(data.url);
          return;
        }
      } catch (err) {
        console.warn("Server endpoint unavailable (e.g. static host/Netlify), using client Data URL fallback:", err.message);
      }
      callback(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // 2. Chunked Large File/Video Upload Handler (with Netlify / static client Data URL fallback)
  const handleVideoChunkUpload = async (file, folder, fileName, onProgress, onDone) => {
    if (!file) return;
    const CHUNK_SIZE = 400 * 1024; // 400KB slices
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    try {
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunkBlob = file.slice(start, end);

        const chunkData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(chunkBlob);
        });

        const res = await fetch("/api/upload-chunk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName,
            folder,
            chunkIndex,
            totalChunks,
            chunkData,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Server returned status ${res.status}: ${errText}`);
        }

        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Chunk upload failed");

        const percent = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        if (onProgress) onProgress(percent);

        if (data.complete && data.url) {
          onDone(data.url);
          return;
        }
      }
    } catch (err) {
      console.warn("[Netlify / Static Fallback] Express backend endpoint unreadable or status 404. Converting media directly to Data URL...", err.message);
      if (onProgress) onProgress(50);
      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        });
        if (onProgress) onProgress(100);
        onDone(dataUrl);
      } catch (fallbackErr) {
        console.error("[Media Upload Fallback Error]", fallbackErr);
        alert("Media upload failed: " + fallbackErr.message);
        setVideoUploading(false);
        setVideoStatus("Upload failed: " + fallbackErr.message);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-white border border-neutral-200 rounded-2xl shadow-sm text-neutral-900">
      <div>
        <h2 className="font-display text-xl font-black uppercase tracking-wider text-black flex items-center gap-2">
          <Sliders className="h-5 w-5 text-black" />
          Brand Assets & Media Management
        </h2>
        <p className="font-mono text-xs text-neutral-500 mt-1">
          Upload custom logos, hero banners, and campaign videos with chunked processing.
        </p>
      </div>

      {/* SECTION 1: BRAND LOGO */}
      <div className="border border-neutral-200 bg-neutral-50/50 p-6 rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h3 className="font-display text-sm font-bold uppercase text-black">1. Official Brand Logo</h3>
            <p className="font-mono text-xs text-neutral-500">
              Upload PNG/SVG logo for navbar header, drawers, and footer.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-neutral-200 px-3 py-1 rounded-full font-bold uppercase">
            Logo Asset
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-neutral-700 uppercase text-[10px] mb-1.5 font-bold">
                Upload Custom Logo Image
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setLogoUploading(true);
                    setLogoStatus("Uploading logo...");
                    handleMediaFileUpload(file, "brand", "fiy-logo.png", (url) => {
                      updateStoreSettings({ logoUrl: url });
                      setLogoUploading(false);
                      setLogoStatus("Logo updated successfully!");
                      setTimeout(() => setLogoStatus(""), 4000);
                    });
                  }
                }}
                className="w-full bg-white border border-neutral-300 p-2 text-neutral-800 rounded-xl text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-neutral-700 uppercase text-[10px] mb-1.5 font-bold">
                Or Direct Image URL / Path
              </label>
              <input
                type="text"
                value={storeSettings.logoUrl || "/images/brand/fiy-logo.png"}
                onChange={(e) => updateStoreSettings({ logoUrl: e.target.value })}
                placeholder="/images/brand/fiy-logo.png or https://..."
                className="w-full bg-white border border-neutral-300 p-2.5 rounded-xl text-xs font-mono"
              />
            </div>

            {/* Logo Visibility & Dark Mode Contrast Options */}
            <div className="bg-white border border-neutral-200 p-3.5 rounded-xl space-y-2.5">
              <span className="block font-bold text-[10px] uppercase text-neutral-800">
                Logo Visibility & Dark Mode Contrast Options
              </span>

              <label className="flex items-center justify-between text-[11px] font-bold text-neutral-700 cursor-pointer">
                <span>1. Glass Disk Badge Backdrop (For dark logos)</span>
                <input
                  type="checkbox"
                  checked={storeSettings.logoBadge ?? true}
                  onChange={(e) => updateStoreSettings({ logoBadge: e.target.checked })}
                  className="h-4 w-4 rounded accent-black"
                />
              </label>

              <label className="flex items-center justify-between text-[11px] font-bold text-neutral-700 cursor-pointer">
                <span>2. Invert Logo Colors (Black → White)</span>
                <input
                  type="checkbox"
                  checked={storeSettings.logoInvert ?? false}
                  onChange={(e) => updateStoreSettings({ logoInvert: e.target.checked })}
                  className="h-4 w-4 rounded accent-black"
                />
              </label>

              <label className="flex items-center justify-between text-[11px] font-bold text-neutral-700 cursor-pointer">
                <span>3. Bright White Aura Glow</span>
                <input
                  type="checkbox"
                  checked={storeSettings.logoGlow ?? true}
                  onChange={(e) => updateStoreSettings({ logoGlow: e.target.checked })}
                  className="h-4 w-4 rounded accent-black"
                />
              </label>
            </div>

            {logoStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" /> {logoStatus}
              </div>
            )}
          </div>

          {/* Live Preview */}
          <div className="border border-neutral-200 bg-neutral-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-widest">
              Live Dark-Mode Header Preview
            </span>
            <div className="p-6 bg-black/80 rounded-full border border-neutral-800 shadow-inner flex items-center justify-center">
              <SpinningLogo
                size={70}
                logoSrc={storeSettings.logoUrl || "/images/brand/fiy-logo.png"}
                logoInvert={storeSettings.logoInvert ?? false}
                logoGlow={storeSettings.logoGlow ?? true}
                logoBadge={storeSettings.logoBadge ?? true}
              />
            </div>
            <button
              type="button"
              onClick={() => updateStoreSettings({
                logoUrl: "/images/brand/fiy-logo.png",
                logoBadge: true,
                logoInvert: false,
                logoGlow: true
              })}
              className="text-[10px] font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-lg font-bold"
            >
              Reset Logo Settings
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: HERO BANNER BACKGROUND (IMAGE & VIDEO TOGGLE) */}
      <div className="border border-neutral-200 bg-neutral-50/50 p-6 rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h3 className="font-display text-sm font-bold uppercase text-black">2. Main Storefront Hero Background</h3>
            <p className="font-mono text-xs text-neutral-500">
              Choose whether the hero displays a high-resolution editorial photo or an autoplay campaign video.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-black text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Active: {(storeSettings.heroMediaType || "image").toUpperCase()}
          </span>
        </div>

        {/* Media Type Toggle Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 border border-neutral-200 rounded-xl">
          <button
            type="button"
            onClick={() => updateStoreSettings({ heroMediaType: "image" })}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              (storeSettings.heroMediaType || "image") === "image"
                ? "bg-black text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Display Image Background
          </button>
          <button
            type="button"
            onClick={() => updateStoreSettings({ heroMediaType: "video" })}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              storeSettings.heroMediaType === "video"
                ? "bg-purple-900 text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:text-purple-900 hover:bg-purple-50"
            }`}
          >
            <Film className="h-4 w-4" />
            Display Campaign Video Background
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-6 font-mono text-xs">
            {/* Image Configuration Box */}
            <div className={`p-4 border rounded-xl space-y-3 transition-colors ${
              (storeSettings.heroMediaType || "image") === "image" ? "border-black bg-white" : "border-neutral-200 bg-neutral-50"
            }`}>
              <div className="flex items-center gap-2 font-bold uppercase text-neutral-900 text-[11px]">
                <ImageIcon className="h-4 w-4 text-black" />
                <span>1. Hero Background Image Settings</span>
              </div>
              <div>
                <label className="block text-neutral-700 uppercase text-[10px] mb-1 font-bold">
                  Upload Hero Photo (JPG, WEBP)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setHeroUploading(true);
                      setHeroStatus("Uploading background image...");
                      handleMediaFileUpload(file, "backgrounds", "hero.jpg", (url) => {
                        updateStoreSettings({ heroBgUrl: url });
                        setHeroUploading(false);
                        setHeroStatus("Hero background image updated!");
                        setTimeout(() => setHeroStatus(""), 4000);
                      });
                    }
                  }}
                  className="w-full bg-white border border-neutral-300 p-2 text-neutral-800 rounded-xl text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-neutral-700 uppercase text-[10px] mb-1 font-bold">
                  Direct Image URL
                </label>
                <input
                  type="text"
                  value={storeSettings.heroBgUrl || "/images/backgrounds/hero.jpg"}
                  onChange={(e) => updateStoreSettings({ heroBgUrl: e.target.value })}
                  className="w-full bg-white border border-neutral-300 p-2.5 rounded-xl text-xs font-mono"
                />
              </div>

              {heroStatus && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" /> {heroStatus}
                </div>
              )}
            </div>

            {/* Video Configuration Box */}
            <div className={`p-4 border rounded-xl space-y-3 transition-colors ${
              storeSettings.heroMediaType === "video" ? "border-purple-800 bg-white" : "border-neutral-200 bg-neutral-50"
            }`}>
              <div className="flex items-center gap-2 font-bold uppercase text-purple-950 text-[11px]">
                <Film className="h-4 w-4 text-purple-700" />
                <span>2. Hero Background Video Settings</span>
              </div>
              <div>
                <label className="block text-neutral-700 uppercase text-[10px] mb-1 font-bold">
                  Upload Hero Background Video (MP4, WebM)
                </label>
                <input
                  type="file"
                  accept="video/mp4, video/webm, video/quicktime"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setVideoUploading(true);
                      setVideoProgress(0);
                      setVideoStatus(`Starting hero background video upload (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);

                      handleVideoChunkUpload(
                        file,
                        "videos",
                        "hero-background.mp4",
                        (percent) => {
                          setVideoProgress(percent);
                          setVideoStatus(`Uploading hero video chunks: ${percent}% complete...`);
                        },
                        (url) => {
                          updateStoreSettings({ heroVideoUrl: url });
                          setVideoUploading(false);
                          setVideoProgress(100);
                          setVideoStatus("Hero background video saved successfully!");
                          setTimeout(() => {
                            setVideoStatus("");
                            setVideoProgress(0);
                          }, 5000);
                        }
                      );
                    }
                  }}
                  className="w-full bg-white border border-neutral-300 p-2.5 text-neutral-800 rounded-xl text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer"
                />
              </div>

              {videoUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-neutral-600">
                    <span>UPLOAD PROGRESS</span>
                    <span>{videoProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 transition-all duration-300 rounded-full"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-neutral-700 uppercase text-[10px] mb-1 font-bold">
                  Direct Hero Video URL
                </label>
                <input
                  type="text"
                  value={storeSettings.heroVideoUrl || "/videos/hero-background.mp4"}
                  onChange={(e) => updateStoreSettings({ heroVideoUrl: e.target.value })}
                  className="w-full bg-white border border-neutral-300 p-2.5 rounded-xl text-xs font-mono"
                />
              </div>

              {videoStatus && (
                <div className="p-2.5 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl font-bold text-xs flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>{videoStatus}</span>
                </div>
              )}
            </div>
          </div>

          {/* Live Hero Media Preview Box */}
          <div className="border border-neutral-200 bg-neutral-900 rounded-2xl overflow-hidden min-h-[260px] relative flex flex-col items-center justify-center p-4">
            {storeSettings.heroMediaType === "video" ? (
              <video
                src={storeSettings.heroVideoUrl || "/videos/hero-background.mp4"}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                poster={storeSettings.heroBgUrl || "/images/backgrounds/hero.jpg"}
              />
            ) : (
              <img
                src={storeSettings.heroBgUrl || "/images/backgrounds/hero.jpg"}
                alt="Hero Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
            )}
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 text-center space-y-2 p-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/70 font-bold bg-black/60 px-3 py-1 rounded-full border border-white/20">
                Live Storefront Preview ({(storeSettings.heroMediaType || "image").toUpperCase()} MODE)
              </span>
              <p className="font-display text-lg font-black uppercase text-white tracking-wider">
                FORTIFIED STOREFRONT
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: CAMPAIGN FILM VIDEO (SEPARATE FROM HERO BACKGROUND) */}
      <div className="border border-neutral-200 bg-neutral-50/50 p-6 rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h3 className="font-display text-sm font-bold uppercase text-black">3. Separate Campaign & Lookbook Film Video</h3>
            <p className="font-mono text-xs text-neutral-500">
              Upload the full cinematic campaign film displayed on the Lookbook page and campaign modal (independent from Hero Background).
            </p>
          </div>
          <span className="text-[10px] font-mono bg-purple-100 text-purple-900 px-3 py-1 rounded-full font-bold uppercase">
            Campaign Film
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center font-mono text-xs">
          <div className="space-y-4">
            <div>
              <label className="block text-neutral-700 uppercase text-[10px] mb-1 font-bold">
                Upload Campaign Film (MP4, WebM, MOV)
              </label>
              <input
                type="file"
                accept="video/mp4, video/webm, video/quicktime"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setVideoUploading(true);
                    setVideoProgress(0);
                    setVideoStatus(`Starting campaign film upload (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);

                    const uniqueName = `campaign_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
                    handleVideoChunkUpload(
                      file,
                      "videos",
                      uniqueName,
                      (percent) => {
                        setVideoProgress(percent);
                        setVideoStatus(`Uploading campaign film chunks: ${percent}% complete...`);
                      },
                      (url) => {
                        updateStoreSettings({ campaignVideoUrl: url });
                        setVideoUploading(false);
                        setVideoProgress(100);
                        setVideoStatus("Campaign film updated successfully!");
                        setTimeout(() => {
                          setVideoStatus("");
                          setVideoProgress(0);
                        }, 5000);
                      }
                    );
                  }
                }}
                className="w-full bg-white border border-neutral-300 p-2.5 text-neutral-800 rounded-xl text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-neutral-700 uppercase text-[10px] mb-1 font-bold">
                Direct Campaign Film URL
              </label>
              <input
                type="text"
                value={storeSettings.campaignVideoUrl || "/videos/campaign.mp4"}
                onChange={(e) => updateStoreSettings({ campaignVideoUrl: e.target.value })}
                className="w-full bg-white border border-neutral-300 p-2.5 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="border border-neutral-200 bg-black rounded-2xl overflow-hidden h-44 relative flex items-center justify-center p-2">
            <video
              src={storeSettings.campaignVideoUrl || "/videos/campaign.mp4"}
              controls
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
