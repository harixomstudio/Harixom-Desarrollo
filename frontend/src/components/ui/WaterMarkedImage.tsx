import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  watermarkText: string;
  className?: string;
}

export default function WatermarkedImage({ src, alt, watermarkText, className }: ImageProps) {
  return (
    <div className={`relative inline-block overflow-hidden ${className}`}>
      {/* Imagen principal */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-lg"
      />

      {/* Marca de agua centrada, con frases una encima de otra */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none rotate-[-30deg]">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="text-white/8 font-semibold select-none text-center whitespace-pre-wrap break-words"
            style={{
              fontSize: "min(2vw, 22px)",
              lineHeight: "1.3em",
            }}
          >
            {watermarkText}
          </span>
        ))}
      </div>
    </div>
  );
}
