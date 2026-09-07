"use client";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Comparison } from "@/registry/components/comparison";
import { CoffeeMachine } from "@/components/coffee-machine";
import { coffeeProducts, coffeeTotal } from "@/lib/coffee-demo";
import { tourDuration, tourSnapshot } from "@/lib/coffee-tour";
import captions from "@/video/remotion/captions.json";
import timing from "@/video/remotion/timing.json";
const chapters = [
  { title: "A better morning", detail: "One task. A shared interface." },
  {
    title: "Set the requirements",
    detail: "32 cm of space. 58 mm accessories.",
  },
  { title: "Compare the evidence", detail: "A recommendation with a reason." },
  { title: "Build a selection", detail: "One machine. A compatible filter." },
  {
    title: "Review the choice",
    detail: "A correction, then a final decision.",
  },
  { title: "Make it yours", detail: "React + shadcn. Open source." },
];
export function LandingTour() {
  const media = useRef<HTMLAudioElement>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const state = tourSnapshot(time);
  const chapter = Math.max(
    0,
    timing.scenes.findLastIndex((s) => time >= s.from / timing.fps),
  );
  const caption = captions.find((c) => time >= c.start && time < c.end)?.text;
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      if (media.current) setTime(media.current.currentTime);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  useEffect(() => {
    const audio = media.current;
    const stop = (e: Event) => {
      if (e.target instanceof HTMLMediaElement && e.target !== audio)
        audio?.pause();
    };
    document.addEventListener("play", stop, true);
    return () => {
      audio?.pause();
      document.removeEventListener("play", stop, true);
    };
  }, []);
  async function play() {
    const audio = media.current;
    if (!audio) return;
    setError("");
    setLoading(true);
    try {
      if (audio.error) audio.load();
      if (time >= tourDuration - 0.1) {
        audio.currentTime = 0;
        setTime(0);
      }
      document.querySelectorAll("video").forEach((v) => v.pause());
      await audio.play();
    } catch {
      setError(
        "Audio could not start. Retry, or explore each chapter using the timeline.",
      );
    } finally {
      setLoading(false);
    }
  }
  function seek(t: number) {
    if (media.current) media.current.currentTime = t;
    setTime(t);
  }
  const price = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  return (
    <div className="tour-theatre overflow-clip rounded-2xl border bg-card">
      <audio
        ref={media}
        src="/api/demo-media/demo-audio.m4a?v=1"
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setTime(tourDuration);
        }}
        onTimeUpdate={() => {
          if (media.current) setTime(media.current.currentTime);
        }}
        onError={() => {
          setPlaying(false);
          setLoading(false);
          setError(
            "Audio is unavailable. Retry playback or explore the chapters.",
          );
        }}
      />
      <div className="sticky top-17 z-20 flex flex-wrap items-center justify-between gap-4 border-b bg-card px-5 py-4 lg:px-8">
        <div>
          <p className="text-xs text-muted-foreground">
            THE MORNING RITUAL / A NARRATED PRODUCT TOUR
          </p>
          <h3 className="mt-1 text-lg font-medium">
            {chapters[chapter].title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-3 hidden text-xs text-muted-foreground sm:inline">
            66 seconds · sound on
          </span>
          <Button
            onClick={() => (playing ? media.current?.pause() : void play())}
            disabled={loading}
            size="sm"
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
              media.current?.pause();
              seek(0);
            }}
          >
            <RotateCcw />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={muted ? "Unmute tour" : "Mute tour"}
            onClick={() => {
              if (media.current) media.current.muted = !muted;
              setMuted(!muted);
            }}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </Button>
        </div>
      </div>
      <div className="grid xl:grid-cols-[220px_minmax(0,1fr)_280px] 2xl:grid-cols-[240px_minmax(0,1fr)_340px]">
        <nav
          aria-label="Tour chapters"
          className="flex gap-2 overflow-x-auto border-b p-3 xl:flex-col xl:border-r xl:border-b-0 xl:p-5"
        >
          {chapters.map((c, i) => (
            <button
              key={c.title}
              onClick={() => seek(timing.scenes[i].from / timing.fps)}
              aria-current={chapter === i ? "step" : undefined}
              className={`flex shrink-0 items-start gap-3 rounded-lg p-3 text-left transition-colors xl:w-full ${chapter === i ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}
            >
              <span className="font-mono text-xs">0{i + 1}</span>
              <span>
                <span className="block text-sm font-medium">{c.title}</span>
                <span className="mt-1 hidden text-xs leading-5 xl:block">
                  {c.detail}
                </span>
              </span>
            </button>
          ))}
        </nav>
        <div className="min-w-0 p-5 sm:p-7 lg:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Find the right fit.</p>
            <div className="flex gap-2 text-xs">
              <span className="rounded-full border px-3 py-1">
                32 cm counter
              </span>
              <span className="rounded-full border px-3 py-1">
                58 mm accessories
              </span>
            </div>
          </div>
          <Comparison
            caption="Your needs"
            columns={coffeeProducts.map((p) => ({
              id: p.id,
              title: p.name,
              subtitle: price.format(p.price),
              visual: (
                <CoffeeMachine
                  color={p.color}
                  className="mx-auto h-24 w-full max-w-40"
                />
              ),
              action: (
                <span
                  data-selected={state.id === p.id || undefined}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors ${state.id === p.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
                >
                  {state.id === p.id ? (
                    <>
                      <Check className="size-3" />
                      Selected
                    </>
                  ) : (
                    "Available"
                  )}
                </span>
              ),
            }))}
            rows={[
              {
                id: "space",
                label: "Counter space",
                highlighted: state.compared,
                values: {
                  studio: (
                    <span>
                      29 cm
                      {state.compared && (
                        <small className="block mt-1">✓ Fits your space</small>
                      )}
                    </span>
                  ),
                  atelier: (
                    <span>
                      36 cm
                      {state.compared && (
                        <small className="block mt-1">Too wide</small>
                      )}
                    </span>
                  ),
                },
              },
              {
                id: "fitting",
                label: "Accessory fit",
                highlighted: state.compared,
                values: {
                  studio: (
                    <span>
                      58 mm
                      {state.compared && (
                        <small className="block mt-1">
                          ✓ Keep your accessories
                        </small>
                      )}
                    </span>
                  ),
                  atelier: (
                    <span>
                      54 mm
                      {state.compared && (
                        <small className="block mt-1">Different fitting</small>
                      )}
                    </span>
                  ),
                },
              },
              {
                id: "milk",
                label: "Two flat whites",
                values: {
                  studio: "Independent steam",
                  atelier: "Independent steam",
                },
              },
            ]}
          />
        </div>
        <aside
          aria-label="Tour result"
          className="flex flex-col border-t bg-muted/30 p-5 sm:p-7 xl:border-t-0 xl:border-l"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {state.review ? "Ready for review" : "Your selection"}
          </p>
          <div className="my-6 flex-1">
            {state.id ? (
              <div key="selected" className="tour-enter">
                <CoffeeMachine
                  color={coffeeProducts[0].color}
                  className="mb-5 h-24 w-32"
                />
                <h4 className="text-xl font-medium">Studio Dual</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fits the counter. Keeps your accessories.
                </p>
                <div
                  className={`mt-5 rounded-lg border p-3 text-sm transition-colors duration-500 ${state.filter ? "bg-lime-100 text-lime-950" : "text-muted-foreground"}`}
                >
                  {state.filter
                    ? "✓ Compatible filter added"
                    : "Compatible filter · optional"}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-5 text-sm leading-6 text-muted-foreground">
                A good recommendation starts with your needs. Follow the
                evidence, then build your selection.
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t pt-5">
            <span className="text-sm text-muted-foreground">Total</span>
            <strong className="text-2xl font-medium tabular-nums">
              {state.id
                ? price.format(coffeeTotal(state.id, state.filter))
                : "—"}
            </strong>
          </div>
          <div
            className={`mt-5 rounded-lg p-4 text-sm transition-colors ${state.review ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
          >
            {state.review ? (
              <span className="flex items-center justify-between">
                Your choice. Your decision.
                <Check className="size-4" />
              </span>
            ) : chapter === 5 ? (
              <a
                href="/examples#comparison"
                className="flex items-center justify-between"
              >
                Try the example
                <ArrowRight className="size-4" />
              </a>
            ) : (
              "Fictional products. No order is created."
            )}
          </div>
        </aside>
      </div>
      <div className="border-t bg-background px-5 py-5 sm:px-8">
        <p
          aria-label="Tour subtitles"
          className="min-h-12 text-base leading-7 sm:text-lg"
        >
          {caption ||
            (time === 0
              ? "Press play. Follow a complete task, from a requirement to a reviewed selection."
              : time >= tourDuration - 0.1
                ? "Built with Fabrials UI. Explore more examples below."
                : "\u00a0")}
        </p>
        <label className="mt-3 flex items-center gap-4">
          <span className="sr-only">Tour position</span>
          <input
            type="range"
            aria-label="Tour position"
            min={0}
            max={tourDuration}
            step={0.1}
            value={time}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-6 min-w-0 flex-1 accent-current"
          />
          <span className="w-20 text-right font-mono text-xs text-muted-foreground">
            {Math.floor(time)} / 66 s
          </span>
        </label>
        {error && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
