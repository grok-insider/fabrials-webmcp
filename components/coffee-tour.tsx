"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import captions from "@/video/remotion/captions.json";
import { tourChapter, tourDuration } from "@/lib/coffee-tour";
export function CoffeeTour({
  time,
  follow,
  onFollow,
  onTime,
  onPlaying,
  onManual,
}: {
  time: number;
  follow: boolean;
  onFollow: (v: boolean) => void;
  onTime: (t: number) => void;
  onPlaying: (v: boolean) => void;
  onManual: () => void;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const callback = useRef(onTime);
  useEffect(() => {
    callback.current = onTime;
  }, [onTime]);
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      if (audio.current) callback.current(audio.current.currentTime);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  useEffect(() => {
    const media = audio.current;
    return () => {
      media?.pause();
      onPlaying(false);
    };
  }, [onPlaying]);
  async function play() {
    if (!audio.current) return;
    if (audio.current.error) audio.current.load();
    setError("");
    setLoading(true);
    try {
      if (audio.current.currentTime >= tourDuration - 0.1) {
        audio.current.currentTime = 0;
        onTime(0);
      }
      await audio.current.play();
    } catch {
      setError("Audio could not start. Retry playback or use manual mode.");
    } finally {
      setLoading(false);
    }
  }
  const caption = captions.find((c) => time >= c.start && time < c.end)?.text;
  return (
    <div
      data-tour-controls
      className="sticky top-17 z-20 border-b bg-background p-5 sm:px-7"
    >
      <audio
        ref={audio}
        src="/api/demo-media/demo-audio.m4a?v=1"
        preload="none"
        onPlay={() => {
          setPlaying(true);
          onPlaying(true);
        }}
        onPause={() => {
          setPlaying(false);
          onPlaying(false);
        }}
        onEnded={() => {
          setPlaying(false);
          onPlaying(false);
          onTime(tourDuration);
        }}
        onTimeUpdate={() => {
          if (audio.current) onTime(audio.current.currentTime);
        }}
        onError={() => {
          audio.current?.pause();
          setPlaying(false);
          onPlaying(false);
          setLoading(false);
          setError(
            "Audio is unavailable. Retry playback or take manual control.",
          );
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">
            Guided tour · original narration & music
          </p>
          <p className="mt-1 font-medium">{tourChapter(time)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={loading}
            onClick={() => {
              if (playing) audio.current?.pause();
              else void play();
            }}
          >
            {playing ? <Pause /> : <Play />}
            {loading
              ? "Loading…"
              : playing
                ? "Pause tour"
                : time >= tourDuration - 0.1
                  ? "Replay tour"
                  : "Play tour"}
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Restart tour"
            onClick={() => {
              audio.current?.pause();
              if (audio.current) audio.current.currentTime = 0;
              onTime(0);
            }}
          >
            <RotateCcw />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={muted ? "Unmute tour" : "Mute tour"}
            onClick={() => {
              if (audio.current) audio.current.muted = !muted;
              setMuted(!muted);
            }}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </Button>
          <Button size="sm" variant="outline" onClick={onManual}>
            Take control
          </Button>
        </div>
      </div>
      <label className="mt-4 flex items-center gap-3">
        <span className="sr-only">Tour position</span>
        <input
          aria-label="Tour position"
          type="range"
          min={0}
          max={tourDuration}
          step={0.1}
          value={time}
          className="h-6 min-w-0 flex-1 accent-current"
          onChange={(e) => {
            const value = Number(e.target.value);
            if (audio.current) audio.current.currentTime = value;
            onTime(value);
          }}
        />
        <span className="w-20 text-right font-mono text-xs text-muted-foreground">
          {Math.floor(time)} / 66 s
        </span>
      </label>
      <label className="mt-2 flex w-fit items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={follow}
          onChange={(e) => onFollow(e.target.checked)}
          className="size-4 accent-current"
        />
        Follow actions on the page
      </label>
      <p
        className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground"
        aria-label="Tour subtitles"
      >
        {caption ||
          (time === 0
            ? "Press play to follow the demo. You can pause, seek or take over at any time."
            : time >= tourDuration - 0.1
              ? "Tour complete. Take control to try it yourself or connect your agent."
              : "\u00a0")}
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
