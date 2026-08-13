import React, { useEffect, useState } from "react";
import { TEE_SLIDESHOW } from "@/lib/media";

/**
 * Looping crossfade slideshow of all T-shirt images.
 * Fills its parent container (parent must be positioned + overflow-hidden).
 */
export default function TeeSlideshow({
  images = TEE_SLIDESHOW,
  interval = 2600,
  className = "",
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`absolute inset-0 h-full w-full overflow-hidden bg-black ${className}`}>
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          loading={i === 0 ? "eager" : "lazy"}
          draggable={false}
        />
      ))}
    </div>
  );
}
