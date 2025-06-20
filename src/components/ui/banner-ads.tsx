import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

export const BannerAd = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});

    // Check after a short delay if the ad loaded
    const timeout = setTimeout(() => {
      const adElement = adRef.current;
      if (adElement) {
        const hasContent = adElement.querySelector('iframe');
        setAdLoaded(!!hasContent);
      }
    }, 2000); // wait 2 seconds for ad to load

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={adRef}
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ height: adLoaded ? 'auto' : 0 }}
    >
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8721978855608987"
        data-ad-slot="1141857510"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};
