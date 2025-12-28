import { useEffect, useRef } from "react";
import { Howl } from "howler";

export function useAudio(src: string | null) {
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!src) return;

    soundRef.current = new Howl({
      src: [src],
      loop: true,
      volume: 0.3,
    });

    return () => {
      soundRef.current?.unload();
    };
  }, [src]);

  return {
    play: () => soundRef.current?.play(),
    pause: () => soundRef.current?.pause(),
  };
}
