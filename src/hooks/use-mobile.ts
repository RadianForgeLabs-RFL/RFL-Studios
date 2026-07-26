import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileDevice = mobileRegex.test(userAgent) || window.innerWidth < 768;
      
      // Check for low-end device characteristics
      const isLowEndDevice = 
        (navigator as any).hardwareConcurrency <= 4 || // Limited CPU cores
        (navigator as any).deviceMemory <= 4 || // Limited RAM (if available)
        window.innerWidth < 768 || // Small screen
        /android/i.test(userAgent); // Android devices often have varying performance

      setIsMobile(isMobileDevice);
      setIsLowEnd(isLowEndDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, isLowEnd };
}
