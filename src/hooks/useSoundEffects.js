import { useCallback, useEffect, useRef, useState } from "react";

const SOUND_STORAGE_KEY = "speedmaths-sound-enabled";

export const useSoundEffects = () => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = window.localStorage.getItem(SOUND_STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const audioCtxRef = useRef(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(soundEnabled));
      } catch {
        // ignore storage errors
      }
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const playTone = useCallback(
    (freq, type = "sine", duration = 0.15, gainVal = 0.12, startTimeOffset = 0) => {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startTime = ctx.currentTime + startTimeOffset;
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      } catch {
        // Audio error handling
      }
    },
    [getAudioContext, soundEnabled],
  );

  const playCorrect = useCallback(() => {
    if (!soundEnabled) return;
    // Pleasant dual chime
    playTone(523.25, "sine", 0.18, 0.12, 0); // C5
    playTone(659.25, "sine", 0.22, 0.14, 0.06); // E5
  }, [playTone, soundEnabled]);

  const playStreak = useCallback(() => {
      if (!soundEnabled) return;
      // Ascending triumphant arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        playTone(freq, "triangle", 0.2, 0.12, idx * 0.06);
      });
    },
    [playTone, soundEnabled],
  );

  const playWrong = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime;
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, startTime);
      osc.frequency.exponentialRampToValueAtTime(110, startTime + 0.18);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.18);
    } catch {
      // Audio error handling
    }
  }, [getAudioContext, soundEnabled]);

  const playTick = useCallback(() => {
    if (!soundEnabled) return;
    playTone(880, "sine", 0.05, 0.06, 0);
  }, [playTone, soundEnabled]);

  const playFanfare = useCallback(() => {
    if (!soundEnabled) return;
    const fanfare = [
      { f: 523.25, d: 0.12, o: 0 },
      { f: 659.25, d: 0.12, o: 0.1 },
      { f: 783.99, d: 0.15, o: 0.2 },
      { f: 1046.5, d: 0.35, o: 0.32 },
    ];
    fanfare.forEach(({ f, d, o }) => {
      playTone(f, "triangle", d, 0.15, o);
    });
  }, [playTone, soundEnabled]);

  return {
    soundEnabled,
    toggleSound,
    playCorrect,
    playStreak,
    playWrong,
    playTick,
    playFanfare,
  };
};
