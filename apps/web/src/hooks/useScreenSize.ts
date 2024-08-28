import { useState, useEffect } from 'react';

export const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState<boolean>();
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setWidth(width);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile, setWidth]);

  return { isMobile, width };
};
