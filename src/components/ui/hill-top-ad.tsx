import { useEffect, useRef, useState } from 'react';

const HilltopAd: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');

    // Original ad script logic
    script.innerHTML = `
      (function(skrwz){
        var d = document,
            s = d.createElement('script'),
            l = d.scripts[d.scripts.length - 1];
        s.settings = skrwz || {};
        s.src = "//fresh-kind.com/b.X/VfscdiG/l/0_YZWdcn/ceKmN9lu/ZtUFlnkFPBTEYA0lMSTdcm2/NoTpEmtTNkjxQcxaN-zbYm1/Mrgs";
        s.async = true;
        s.referrerPolicy = 'no-referrer-when-downgrade';
        l.parentNode.insertBefore(s, l);
      })({});
    `;

    // Append script inside the ad container
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // Try to detect when ad iframe is added
    const observer = new MutationObserver(() => {
      if (containerRef.current?.querySelector('iframe')) {
        setAdLoaded(true);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: adLoaded ? 'auto' : '0px',
        overflow: 'hidden',
      }}
    />
  );
};

export default HilltopAd;
