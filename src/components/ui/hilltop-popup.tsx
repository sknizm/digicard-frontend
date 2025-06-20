// src/components/ui/HilltopAd.tsx
import { useEffect, useRef } from "react";

const HilltopAd: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Prevent duplicate loading
    const existingScript = document.querySelector(
      'script[src*="smoggyfeed.com"]'
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.src =
      "//smoggyfeed.com/cYD.9T6/bn2Q5CleScW/QQ9INTjKQmylO/DoEJzqN/yk0/2_NtD/Iv4DMMTQME4a";
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";

    // Type-safe extension
    (script as HTMLScriptElement & { settings: object }).settings = {};

    adRef.current.appendChild(script);
  }, []);

  return (
    <div
      ref={adRef}
      className="my-4 w-full h-auto rounded border border-gray-200 bg-white p-4 text-center"
    >
      <p className="text-xs text-muted-foreground mb-2">
        Advertisement
      </p>
      {/* The ad script will inject ad content here */}
    </div>
  );
};

export default HilltopAd;
