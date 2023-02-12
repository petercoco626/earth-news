import { useCallback, useEffect, useState } from "react";

interface IWindowSize {
  width: number;
  height: number;
}

export function useResize(): IWindowSize {
  const [windowSize, setWindowSize] = useState<IWindowSize>({
    width: 1920,
    height: 1080,
  });

  useEffect(() => {
    const resize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return windowSize;
}
