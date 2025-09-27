import  { useEffect, useRef } from "react";
import { addWatermark } from "../ui/WaterMark";

interface ImageProps {
  src: string;
  alt: string;
  watermarkText: string;
  className?: string;
}

export default function WatermarkedImage({ src, alt, watermarkText, className }: ImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const applyWatermark = async () => {
      if (!canvasRef.current) return;

      try {
        const watermarkedUrl = await addWatermark(src, watermarkText);
        const ctx = canvasRef.current.getContext("2d");

        if (ctx) {
          const img = new Image();
          img.src = watermarkedUrl;

          img.onload = () => {
            canvasRef.current!.width = img.width;
            canvasRef.current!.height = img.height;
            ctx.drawImage(img, 0, 0);
          };
        }
      } catch (error) {
        console.error("Error al aplicar la marca de agua:", error);
      }
    };

    applyWatermark();
  }, [src, watermarkText]);

  return (
    <div className={`relative ${className}`}>
      {/* Canvas con la imagen y marca de agua */}
      <canvas ref={canvasRef} aria-label={alt} className="w-full h-full" />
    </div>
  );
}