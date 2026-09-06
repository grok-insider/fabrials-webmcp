import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import timing from "./timing.json";
import { narration } from "./script";
const INK = "#171918",
  MUTED = "#6e746f",
  PAPER = "#f4f5ef",
  LINE = "#dce0d8",
  LIME = "#c5f36c";
const mono = "ui-monospace, SFMono-Regular, monospace";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const range = (f: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(f, [a, b], [x, y], clamp);
function Reveal({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const f = useCurrentFrame();
  const p = spring({
    frame: f - delay,
    fps: 30,
    config: { damping: 22, stiffness: 115, mass: 0.85 },
  });
  return (
    <div
      style={{
        opacity: range(f, delay, delay + 12),
        transform: `translateY(${(1 - p) * 48}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function Mark({ size = 45 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM15 14l6 6m0-6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
function Cursor({
  x,
  y,
  click = false,
  label = "You",
}: {
  x: number;
  y: number;
  click?: boolean;
  label?: string;
}) {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${click ? 0.9 : 1})`,
        zIndex: 5,
      }}
    >
      {click && (
        <div
          style={{
            position: "absolute",
            width: 80,
            height: 80,
            left: -28,
            top: -28,
            border: `3px solid ${LIME}`,
            borderRadius: 100,
            opacity: 0.8,
            transform: `scale(${0.8 + (f % 15) / 15})`,
          }}
        />
      )}
      <svg width="38" height="45" viewBox="0 0 30 36">
        <path
          d="M3 2L26 23L15 24L10 34Z"
          fill={INK}
          stroke="white"
          strokeWidth="2"
        />
      </svg>
      <div
        style={{
          marginLeft: 25,
          marginTop: -4,
          background: INK,
          color: "white",
          fontSize: 20,
          padding: "7px 15px",
          borderRadius: 8,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
}
function Shell({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 24,
        boxShadow: "0 30px 90px #1b261017",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          height: 62,
          borderBottom: `1px solid ${LINE}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 26px",
        }}
      >
        {[0, 1, 2].map((n) => (
          <span
            key={n}
            style={{
              width: 10,
              height: 10,
              borderRadius: 20,
              background: LINE,
            }}
          />
        ))}
        <span
          style={{
            fontFamily: mono,
            fontSize: 16,
            marginLeft: 14,
            color: MUTED,
          }}
        >
          fabrials / project explorer
        </span>
      </div>
      {children}
    </div>
  );
}
function Table({
  filtered = false,
  selected = false,
  frame = 0,
}: {
  filtered?: boolean;
  selected?: boolean;
  frame?: number;
}) {
  const rows = filtered
    ? [
        ["WebMCP", "Browser"],
        ["Chrome DevTools", "Browser"],
      ]
    : [
        ["WebMCP", "Browser"],
        ["Model Context Protocol", "Protocol"],
        ["shadcn/ui", "Interface"],
        ["Chrome DevTools", "Browser"],
      ];
  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
        <div
          style={{
            flex: 1,
            border: `1px solid ${LINE}`,
            borderRadius: 10,
            padding: "17px 20px",
            fontSize: 23,
            color: MUTED,
          }}
        >
          ⌕ <span style={{ marginLeft: 12 }}>Search projects…</span>
        </div>
        <div
          style={{
            minWidth: 190,
            border: `1px solid ${filtered ? INK : LINE}`,
            background: filtered ? LIME : "white",
            borderRadius: 10,
            padding: "17px 20px",
            fontSize: 23,
          }}
        >
          {filtered ? "Browser" : "All categories"}{" "}
          <span style={{ float: "right", marginLeft: 18 }}>⌄</span>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "50px 1fr 220px",
          padding: "13px 18px",
          fontSize: 17,
          color: MUTED,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <span />
        <span>PROJECT</span>
        <span>CATEGORY</span>
      </div>
      {rows.map(([name, cat], i) => (
        <div
          key={name}
          style={{
            display: "grid",
            gridTemplateColumns: "50px 1fr 220px",
            alignItems: "center",
            height: 83,
            padding: "0 18px",
            fontSize: 25,
            borderBottom: `1px solid ${LINE}`,
            background: selected && i === 0 ? "#eaf8d5" : "white",
            opacity: range(frame, i * 3, i * 3 + 12),
            transform: `translateY(${range(frame, i * 3, i * 3 + 18, 14, 0)}px)`,
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              border: `1.5px solid ${selected && i === 0 ? INK : LINE}`,
              borderRadius: 5,
              background: selected && i === 0 ? INK : "white",
              color: LIME,
              fontSize: 20,
              textAlign: "center",
            }}
          >
            {selected && i === 0 ? "✓" : ""}
          </span>
          <span>{name}</span>
          <span style={{ fontSize: 21, color: MUTED }}>{cat}</span>
        </div>
      ))}
      <div style={{ marginTop: 22, fontSize: 19, color: MUTED }}>
        {filtered ? "2" : "4"} projects{selected ? " · 1 selected" : ""}
      </div>
    </div>
  );
}
function Frame({
  index,
  dark = false,
  children,
}: {
  index: number;
  dark?: boolean;
  children: React.ReactNode;
}) {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: dark ? INK : PAPER,
        color: dark ? PAPER : INK,
        fontFamily: "Plex, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: dark ? 0.055 : 0.28,
          backgroundImage: `radial-gradient(${dark ? "#fff" : "#9ea798"} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          transform: `translateY(${(f / 30) % 30}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 76,
          right: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 29,
            fontWeight: 500,
          }}
        >
          <Mark size={35} />
          fabrials <span style={{ opacity: 0.45 }}>/ ui</span>
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 17,
            letterSpacing: 2,
            opacity: 0.6,
          }}
        >
          WEBMCP + MCP / {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      {children}
      <div
        style={{
          position: "absolute",
          bottom: 53,
          left: 76,
          right: 76,
          display: "flex",
          gap: 10,
        }}
      >
        {narration.map((n, i) => (
          <div
            key={n.id}
            style={{
              height: 3,
              flex: 1,
              background: i === index ? LIME : dark ? "#454a43" : "#dce0d8",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
}
function Heading({ index, width = 650 }: { index: number; width?: number }) {
  return (
    <div style={{ position: "absolute", top: 220, left: 90, width }}>
      <Reveal>
        <div
          style={{
            fontFamily: mono,
            fontSize: 19,
            letterSpacing: 2,
            color: MUTED,
            marginBottom: 26,
          }}
        >
          {narration[index].eyebrow}
        </div>
      </Reveal>
      <Reveal delay={8}>
        <h1
          style={{
            fontSize: 88,
            fontWeight: 500,
            letterSpacing: -4.5,
            lineHeight: 1.07,
            whiteSpace: "pre-line",
            margin: 0,
          }}
        >
          {narration[index].title}
        </h1>
      </Reveal>
    </div>
  );
}
function Intro() {
  const f = useCurrentFrame();
  return (
    <Frame index={0} dark>
      <div style={{ position: "absolute", left: 90, top: 215 }}>
        <Reveal>
          <div
            style={{
              fontFamily: mono,
              fontSize: 22,
              color: LIME,
              letterSpacing: 3,
            }}
          >
            ONE SHARED APPLICATION STATE
          </div>
        </Reveal>
        <Reveal delay={12}>
          <div
            style={{
              fontSize: 148,
              lineHeight: 1.02,
              letterSpacing: -8,
              fontWeight: 500,
              marginTop: 28,
            }}
          >
            One interface.
            <br />
            <span style={{ color: LIME }}>Two ways in.</span>
          </div>
        </Reveal>
        <Reveal delay={40}>
          <p style={{ fontSize: 31, color: "#b9c0b4", marginTop: 34 }}>
            React + shadcn. Made for people and agents.
          </p>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 265,
          width: 580,
          height: 480,
        }}
      >
        {[
          { text: "People", y: 0 },
          { text: "Agents", y: 170 },
        ].map((n, i) => (
          <Reveal
            key={n.text}
            delay={30 + i * 14}
            style={{ position: "absolute", top: n.y, left: 0, width: 265 }}
          >
            <div
              style={{
                padding: "28px 30px",
                border: "1px solid #4c5248",
                borderRadius: 18,
                fontSize: 37,
                background: "#232720",
                display: "flex",
                gap: 20,
              }}
            >
              <span style={{ color: LIME }}>{i ? "{}" : "↗"}</span>
              {n.text}
            </div>
          </Reveal>
        ))}
        <svg
          width="580"
          height="450"
          style={{ position: "absolute", top: 40, left: 0 }}
        >
          <path
            d="M266 15H335V185H400M266 185H400"
            fill="none"
            stroke="#707966"
            strokeWidth="2"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - range(f, 55, 100)}
          />
          <circle
            cx={335 + range(f % 90, 0, 90) * 65}
            cy={185}
            r={7}
            fill={LIME}
            opacity={range(f, 90, 105)}
          />
        </svg>
        <Reveal
          delay={80}
          style={{ position: "absolute", top: 153, left: 400 }}
        >
          <div
            style={{
              width: 110,
              height: 110,
              background: LIME,
              color: INK,
              borderRadius: 25,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Mark size={68} />
          </div>
        </Reveal>
      </div>
    </Frame>
  );
}
function Human() {
  const f = useCurrentFrame();
  const filter = f > 95,
    select = f > 165;
  return (
    <Frame index={1}>
      <Heading index={1} />
      <Reveal delay={20} style={{ position: "absolute", left: 90, top: 550 }}>
        <div style={{ fontSize: 29, color: MUTED, lineHeight: 1.6 }}>
          Search. Filter. Select.
          <br />
          Your users stay in control.
        </div>
      </Reveal>
      <Reveal
        delay={12}
        style={{ position: "absolute", left: 800, top: 200, width: 1030 }}
      >
        <Shell>
          <Table frame={f - 15} filtered={filter} selected={select} />
        </Shell>
      </Reveal>
      <Cursor
        x={interpolate(f, [35, 80, 120, 158], [1650, 1660, 970, 865], clamp)}
        y={interpolate(f, [35, 80, 120, 158], [720, 322, 470, 447], clamp)}
        click={(f > 92 && f < 105) || (f > 162 && f < 177)}
      />
      {select && (
        <Reveal style={{ position: "absolute", left: 820, top: 780 }}>
          <div
            style={{
              fontSize: 24,
              padding: "16px 24px",
              background: LIME,
              borderRadius: 12,
            }}
          >
            ✓ Selection updated in shared state
          </div>
        </Reveal>
      )}
    </Frame>
  );
}
function Tool() {
  const f = useCurrentFrame();
  const typed = "filter_projects";
  const progress = range(f, 38, 90);
  const filtered = f > 140;
  return (
    <Frame index={2}>
      <div style={{ position: "absolute", top: 170, left: 90, right: 90 }}>
        <Reveal>
          <div
            style={{
              fontFamily: mono,
              fontSize: 19,
              letterSpacing: 2,
              color: MUTED,
            }}
          >
            {narration[2].eyebrow}
          </div>
        </Reveal>
        <Reveal delay={6}>
          <h1
            style={{
              fontSize: 92,
              fontWeight: 500,
              letterSpacing: -4,
              margin: "20px 0 0",
            }}
          >
            A tool call. <span style={{ color: MUTED }}>The same result.</span>
          </h1>
        </Reveal>
      </div>
      <Reveal
        delay={15}
        style={{ position: "absolute", top: 360, left: 90, width: 770 }}
      >
        <div
          style={{
            background: INK,
            color: PAPER,
            borderRadius: 24,
            padding: 34,
            height: 407,
          }}
        >
          <div
            style={{
              fontSize: 19,
              color: "#a8b29e",
              letterSpacing: 2,
              marginBottom: 34,
            }}
          >
            STRUCTURED ACTION / SIMULATED
          </div>
          <div style={{ fontFamily: mono, fontSize: 30, lineHeight: 1.85 }}>
            <span style={{ color: LIME }}>
              {typed.slice(0, Math.floor(progress * typed.length))}
            </span>
            {f < 95 ? (
              <span style={{ opacity: f % 30 < 15 ? 1 : 0 }}>▌</span>
            ) : (
              <>
                <span>({"{"}</span>
                <br />
                <span style={{ paddingLeft: 30 }}>
                  query: <span style={{ color: "#d4eab2" }}>&quot;&quot;</span>,
                </span>
                <br />
                <span style={{ paddingLeft: 30 }}>
                  category:{" "}
                  <span style={{ color: LIME }}>&quot;Browser&quot;</span>
                </span>
                <br />
                {"})"}
              </>
            )}
          </div>
        </div>
        <div
          style={{
            height: 70,
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            gap: 15,
            padding: "0 25px",
            background: filtered ? LIME : "#e5e9df",
            borderRadius: 12,
            fontSize: 25,
            opacity: range(f, 100, 120),
          }}
        >
          {filtered ? "✓ Completed" : "● Validating arguments"}
          {filtered && (
            <code style={{ marginLeft: "auto", fontFamily: mono }}>
              {"{ visible: 2 }"}
            </code>
          )}
        </div>
      </Reveal>
      <svg
        width="120"
        height="160"
        style={{ position: "absolute", left: 865, top: 500 }}
      >
        <path
          d="M8 80H110m-18-18 18 18-18 18"
          stroke={INK}
          strokeWidth="3"
          fill="none"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - range(f, 110, 140)}
        />
      </svg>
      <Reveal
        delay={25}
        style={{ position: "absolute", left: 990, top: 360, width: 840 }}
      >
        <Shell>
          <Table frame={f - 25} filtered={filtered} />
        </Shell>
      </Reveal>
    </Frame>
  );
}
function Native() {
  const f = useCurrentFrame();
  const p = range(f, 55, 105);
  return (
    <Frame index={3}>
      <Heading index={3} width={800} />
      <Reveal
        delay={20}
        style={{ position: "absolute", left: 90, top: 445, width: 750 }}
      >
        <p style={{ fontSize: 31, color: MUTED, lineHeight: 1.55 }}>
          Expose structured tools.
          <br />
          Keep the interface people already know.
        </p>
        <div
          style={{
            display: "inline-flex",
            background: "#e7ebdf",
            borderRadius: 30,
            padding: "13px 23px",
            fontSize: 22,
            marginTop: 20,
          }}
        >
          ● Experimental browser support required
        </div>
      </Reveal>
      <div
        style={{
          position: "absolute",
          left: 950,
          top: 220,
          width: 830,
          height: 620,
        }}
      >
        <Reveal delay={15}>
          <Shell>
            <div style={{ padding: 38 }}>
              <div style={{ fontSize: 36, fontWeight: 500, marginBottom: 32 }}>
                Your browser
              </div>
              {["filter_projects", "select_projects"].map((name, i) => (
                <Reveal key={name} delay={45 + i * 18}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      padding: 24,
                      background: i ? "#f2f4ed" : LIME,
                      borderRadius: 14,
                      marginBottom: 16,
                      fontFamily: mono,
                      fontSize: 27,
                    }}
                  >
                    <span>{"{}"}</span>
                    {name}
                    <span style={{ marginLeft: "auto", opacity: p }}>✓</span>
                  </div>
                </Reveal>
              ))}
              <div
                style={{
                  marginTop: 32,
                  borderTop: `1px solid ${LINE}`,
                  paddingTop: 28,
                  fontSize: 23,
                  color: MUTED,
                }}
              >
                Registered tools → shared application state
              </div>
            </div>
          </Shell>
        </Reveal>
        <Reveal delay={125} style={{ marginTop: 22, display: "flex", gap: 14 }}>
          {["Human controls ✓", "Agent access ✓"].map((t) => (
            <div
              key={t}
              style={{
                flex: 1,
                textAlign: "center",
                background: INK,
                color: PAPER,
                padding: 22,
                borderRadius: 14,
                fontSize: 25,
              }}
            >
              {t}
            </div>
          ))}
        </Reveal>
      </div>
    </Frame>
  );
}
function Remote() {
  const f = useCurrentFrame();
  const connected = f > 55,
    ran = f > 135,
    input = f > 205;
  return (
    <Frame index={4}>
      <div style={{ position: "absolute", top: 175, left: 90 }}>
        <Reveal>
          <div
            style={{
              fontFamily: mono,
              fontSize: 19,
              letterSpacing: 2,
              color: MUTED,
            }}
          >
            {narration[4].eyebrow}
          </div>
        </Reveal>
        <Reveal delay={8}>
          <h1
            style={{
              fontSize: 88,
              fontWeight: 500,
              letterSpacing: -4,
              margin: "22px 0",
            }}
          >
            Connect. Discover. Get things done.
          </h1>
        </Reveal>
      </div>
      <Reveal
        delay={15}
        style={{ position: "absolute", top: 350, left: 90, width: 590 }}
      >
        <div
          style={{
            background: INK,
            color: PAPER,
            borderRadius: 22,
            padding: 30,
          }}
        >
          <div style={{ fontSize: 28 }}>MCP server</div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 20,
              color: "#b4c5a5",
              marginTop: 20,
            }}
          >
            ui.fabrials.com/api/demo/mcp
          </div>
          <div
            style={{
              height: 49,
              marginTop: 25,
              background: connected ? LIME : "#3b4434",
              color: connected ? INK : PAPER,
              borderRadius: 10,
              display: "grid",
              placeItems: "center",
              fontSize: 22,
            }}
          >
            {connected ? "✓ Connected · MCP 2026-07-28" : "Connecting…"}
          </div>
        </div>
        <div
          style={{
            marginTop: 20,
            background: "white",
            border: `1px solid ${LINE}`,
            borderRadius: 22,
            padding: 26,
          }}
        >
          <div style={{ fontSize: 19, color: MUTED, marginBottom: 16 }}>
            DISCOVERED TOOLS
          </div>
          {["search_catalog", "build_report", "personalize_greeting"].map(
            (s, i) => (
              <div
                key={s}
                style={{
                  fontFamily: mono,
                  fontSize: 23,
                  padding: "16px 0",
                  borderBottom: i < 2 ? `1px solid ${LINE}` : undefined,
                  opacity: range(f, 65 + i * 10, 85 + i * 10),
                }}
              >
                {s}
                <span style={{ float: "right" }}>↗</span>
              </div>
            ),
          )}
        </div>
      </Reveal>
      <Reveal
        delay={25}
        style={{ position: "absolute", left: 750, top: 350, width: 1080 }}
      >
        <div
          style={{
            background: "white",
            border: `1px solid ${LINE}`,
            borderRadius: 22,
            padding: 34,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 27,
            }}
          >
            <span>search_catalog</span>
            <span style={{ fontSize: 22, color: MUTED }}>
              {ran ? "Completed" : "Ready"}
            </span>
          </div>
          <div
            style={{
              height: 4,
              background: "#e7ebdf",
              marginTop: 27,
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: `${range(f, 95, 135) * 100}%`,
                height: "100%",
                background: INK,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 27,
              fontFamily: mono,
              fontSize: 28,
              lineHeight: 1.7,
              opacity: range(f, 130, 148),
            }}
          >
            <span style={{ color: MUTED }}>{"// structured result"}</span>
            <br />
            {"{"}
            <br />
            &nbsp; records: <span style={{ color: "#466b16" }}>6 projects</span>
            <br />
            {"}"}
          </div>
        </div>
        <Reveal delay={195} style={{ marginTop: 22 }}>
          <div
            style={{
              border: `2px solid ${INK}`,
              borderRadius: 18,
              background: PAPER,
              padding: "23px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 26,
            }}
          >
            <span>
              {input ? "Needs your input" : "Progress and results stay visible"}
            </span>
            <span
              style={{
                background: LIME,
                padding: "12px 25px",
                borderRadius: 9,
                fontSize: 22,
              }}
            >
              You decide →
            </span>
          </div>
        </Reveal>
      </Reveal>
    </Frame>
  );
}
function Outro() {
  const f = useCurrentFrame();
  const command = "bunx shadcn@latest add";
  return (
    <Frame index={5} dark>
      <Reveal style={{ position: "absolute", left: 90, top: 205 }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: 21,
            letterSpacing: 3,
            color: LIME,
          }}
        >
          YOUR COMPONENTS. YOUR CODE.
        </div>
        <h1
          style={{
            fontSize: 128,
            lineHeight: 1.07,
            letterSpacing: -6,
            fontWeight: 500,
            margin: "28px 0",
          }}
        >
          Build for people.
          <br />
          <span style={{ color: LIME }}>Make room for agents.</span>
        </h1>
      </Reveal>
      <Reveal
        delay={35}
        style={{ position: "absolute", left: 90, top: 600, right: 90 }}
      >
        <div
          style={{
            border: "1px solid #505846",
            background: "#23271f",
            borderRadius: 20,
            padding: "28px 34px",
            fontFamily: mono,
            fontSize: 29,
            display: "flex",
            gap: 20,
          }}
        >
          <span style={{ color: LIME }}>$</span>
          <span>
            {command.slice(0, Math.floor(range(f, 40, 85) * command.length))}
            <span style={{ color: "#cbd7bd", opacity: range(f, 80, 110) }}>
              {" "}
              https://ui.fabrials.com/r/webmcp-provider.json
            </span>
          </span>
        </div>
      </Reveal>
      <Reveal
        delay={125}
        style={{
          position: "absolute",
          left: 90,
          top: 790,
          fontSize: 43,
          display: "flex",
          alignItems: "center",
          gap: 22,
        }}
      >
        <span style={{ borderBottom: `2px solid ${LIME}`, paddingBottom: 10 }}>
          ui.fabrials.com
        </span>
        <span style={{ color: LIME }}>↗</span>
      </Reveal>
    </Frame>
  );
}
const views = [Intro, Human, Tool, Native, Remote, Outro];
export function Film() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scene = timing.scenes.findIndex(
    (s) => frame >= s.from && frame < s.from + s.frames,
  );
  const current = timing.scenes[Math.max(0, scene)];
  const text = narration[Math.max(0, scene)].text;
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const elapsed = Math.max(0, frame - current.from - 15) / 30;
  const totalWords = text.split(/\s+/).length;
  let position = 0;
  let caption = "";
  for (const sentence of sentences) {
    const length = sentence.trim().split(/\s+/).length;
    const start = (position / totalWords) * current.speechSeconds;
    position += length;
    if (
      elapsed >= start &&
      elapsed < (position / totalWords) * current.speechSeconds
    )
      caption = sentence.trim();
  }
  return (
    <AbsoluteFill>
      <style>{`@font-face{font-family:Plex;src:url('${staticFile("IBMPlexSans.woff2")}') format('woff2');font-weight:100 900}*{box-sizing:border-box}`}</style>
      <TransitionSeries>
        {views.flatMap((View, i) => {
          const children = [
            <TransitionSeries.Sequence
              key={i}
              durationInFrames={timing.scenes[i].frames + (i < 5 ? 18 : 0)}
            >
              <View />
            </TransitionSeries.Sequence>,
          ];
          if (i < 5)
            children.push(
              <TransitionSeries.Transition
                key={`t${i}`}
                presentation={fade()}
                timing={linearTiming({ durationInFrames: 18 })}
              />,
            );
          return children;
        })}
      </TransitionSeries>
      {timing.scenes.map((s, i) => (
        <Sequence
          key={s.id}
          from={s.from + 15}
          durationInFrames={Math.ceil(s.speechSeconds * 30)}
        >
          <Audio src={staticFile(`voice-${i}.mp3`)} volume={1} />
        </Sequence>
      ))}
      <Audio
        src={staticFile("music.wav")}
        volume={(f) =>
          Math.min(
            range(f, 0, 60, 0, 0.28),
            range(f, durationInFrames - 90, durationInFrames, 0.28, 0),
          )
        }
      />
      {caption && (
        <div
          style={{
            position: "absolute",
            bottom: 82,
            left: 160,
            right: 160,
            textAlign: "center",
            fontFamily: "Plex",
            fontSize: 26,
            lineHeight: 1.4,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              display: "inline-block",
              maxWidth: 1510,
              padding: "12px 26px",
              borderRadius: 12,
              background: "#171918ed",
              color: "#f4f5ef",
            }}
          >
            {caption}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
}
