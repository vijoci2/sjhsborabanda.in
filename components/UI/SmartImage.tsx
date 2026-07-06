"use client";

import { useState } from "react";

type SmartImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  priority?: boolean;
};

export function SmartImage({
  src,
  alt,
  className = "",
  fallbackLabel,
  priority = false
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark p-6 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white/80`}
        role="img"
        aria-label={alt}
      >
        {fallbackLabel ?? alt}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
