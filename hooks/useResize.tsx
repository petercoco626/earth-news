import { useCallback, useEffect, useState } from "react";

interface IWindowSize {
  width: number;
  height: number;
}

export function useResize({ width, height }: IWindowSize): IWindowSize {
  const [windowSize, setWindowSize] = useState<IWindowSize>({
    width,
    height,
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
