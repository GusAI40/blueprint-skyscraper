import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  random,
  useCurrentFrame,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Drift, Glow, HudCorners, Starfield, Vignette } from "../fx";
import { fontStack, monoStack, palette } from "../theme";

const TOTAL_FLOORS = 40;
const TRANSITION_FRAMES = 15;
const WINDOWS_PER_FLOOR = 7;

// ---------------------------------------------------------------------------
// Scene 1 — Blueprint. The tower draws itself onto an engineering grid while
// a scanner sweeps the sheet and the project HUD types on.
// ---------------------------------------------------------------------------
const Blueprint: React.FC = () => {
  const frame = useCurrentFrame();

  const gridIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });
  // Outline draws on first, then floor plates, then the lattice bracing.
  const outlineDraw = interpolate(frame, [6, 48], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const platesDraw = interpolate(frame, [30, 62], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanY = interpolate(frame, [10, 72], [8, 92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanOpacity = interpolate(frame, [10, 18, 64, 72], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const calloutIn = interpolate(frame, [52, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const projectLine = "PRJ-2189 · THE PINNACLE · SUPERTALL";
  const typedChars = Math.floor(
    interpolate(frame, [4, 40], [0, projectLine.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const cursorOn = Math.floor(frame / 12) % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: palette.blueprintBg }}>
      <Drift from={1} to={1.045}>
      <Glow x="20%" y="12%" size={900} color="rgba(30,144,255,0.14)" />
      <Glow x="85%" y="90%" size={1100} color="rgba(103,232,249,0.08)" />

      {/* Engineering grid: fine mesh with heavier module lines */}
      <div style={{ position: "absolute", inset: 0, opacity: gridIn }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={`h${i}`} style={{
            position: "absolute", left: 0, top: `${(i / 40) * 100}%`,
            width: "100%", height: 1,
            backgroundColor: `rgba(30,144,255,${i % 5 === 0 ? 0.16 : 0.06})`,
          }} />
        ))}
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={`v${i}`} style={{
            position: "absolute", left: `${(i / 60) * 100}%`, top: 0,
            width: 1, height: "100%",
            backgroundColor: `rgba(30,144,255,${i % 5 === 0 ? 0.16 : 0.06})`,
          }} />
        ))}
      </div>

      {/* Scanner sweep */}
      <div style={{
        position: "absolute", left: 0, top: `${scanY}%`, width: "100%", height: 120,
        transform: "translateY(-50%)", opacity: scanOpacity,
        background: "linear-gradient(180deg, transparent, rgba(103,232,249,0.10) 45%, rgba(103,232,249,0.35) 50%, rgba(103,232,249,0.10) 55%, transparent)",
      }} />

      {/* Tower blueprint — strokes draw on via pathLength dash animation */}
      <svg viewBox="0 0 400 800" style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%,-50%)", width: "40%", height: "80%",
        filter: "drop-shadow(0 0 14px rgba(30,144,255,0.35))",
      }}>
        <path
          d="M150,750 L150,250 L130,200 Q200,150 270,200 L250,250 L250,750 Z"
          fill="none" stroke={palette.azure} strokeWidth="3" opacity={0.9}
          pathLength={1} strokeDasharray={1} strokeDashoffset={outlineDraw}
        />
        <path
          d="M150,650 L250,650 M155,550 L245,550 M160,450 L240,450 M165,350 L235,350 M170,280 L230,280"
          fill="none" stroke={palette.azure} strokeWidth="1.5" opacity={0.55}
          pathLength={1} strokeDasharray={1} strokeDashoffset={platesDraw}
        />
        {Array.from({ length: 15 }).map((_, i) => {
          const braceIn = interpolate(frame, [40 + i * 1.6, 48 + i * 1.6], [0, 0.45], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <line key={i} x1={150 + i * 3} y1={700 - i * 35} x2={250 - i * 3} y2={700 - i * 35}
              stroke={palette.azure} strokeWidth="1" opacity={braceIn} />
          );
        })}
        {/* Dimension callout */}
        <g opacity={calloutIn}>
          <line x1={262} y1={200} x2={262} y2={750} stroke={palette.cyan} strokeWidth="1" opacity={0.5} />
          <line x1={256} y1={200} x2={268} y2={200} stroke={palette.cyan} strokeWidth="1" opacity={0.5} />
          <line x1={256} y1={750} x2={268} y2={750} stroke={palette.cyan} strokeWidth="1" opacity={0.5} />
          <text x={274} y={480} fill={palette.cyan} fontSize={15} fontFamily={monoStack}>380m</text>
          <text x={274} y={502} fill={palette.cyan} fontSize={10} opacity={0.6} fontFamily={monoStack}>{TOTAL_FLOORS} FLOORS</text>
        </g>
      </svg>

      <HudCorners color="rgba(103,232,249,0.55)" />

      {/* HUD readouts */}
      <div style={{
        position: "absolute", top: 52, left: 110,
        color: palette.cyan, fontSize: 20, fontFamily: monoStack, letterSpacing: 3, opacity: 0.85,
      }}>
        {projectLine.slice(0, typedChars)}
        <span style={{ opacity: cursorOn ? 0.9 : 0 }}>▌</span>
      </div>
      <div style={{
        position: "absolute", top: 48, right: 110,
        padding: "6px 14px", border: "1px solid rgba(103,232,249,0.45)", borderRadius: 3,
        color: palette.cyan, fontSize: 14, fontFamily: monoStack, letterSpacing: 2,
        opacity: calloutIn * 0.9,
      }}>
        REV C — APPROVED
      </div>

      <div style={{
        position: "absolute", bottom: 56, width: "100%", textAlign: "center",
        fontFamily: fontStack,
      }}>
        <div style={{
          color: palette.cyan, fontSize: 15, letterSpacing: 8, opacity: 0.7,
          textTransform: "uppercase", marginBottom: 8,
        }}>
          Architectural Vision
        </div>
        <div style={{
          fontSize: 44, fontWeight: 800, letterSpacing: 10,
          background: `linear-gradient(90deg, ${palette.azure}, ${palette.cyan})`,
          WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
        }}>
          THE PINNACLE
        </div>
      </div>
      </Drift>

      <Vignette strength={0.6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — Construction. Night turns to dawn while the tower rises floor by
// floor, each new storey flashing as it is welded on.
// ---------------------------------------------------------------------------
const Construction: React.FC = () => {
  const frame = useCurrentFrame();
  const buildProgress = interpolate(frame, [0, 90], [0, 1], {
    extrapolateRight: "clamp",
  });
  const floorCount = Math.floor(buildProgress * TOTAL_FLOORS);

  const skyTop = interpolateColors(frame, [0, 60, 110], ["#04060F", "#140B2E", "#2D1B4E"]);
  const skyMid = interpolateColors(frame, [0, 60, 110], ["#0A0F1F", "#3A1B4E", "#8A3B4A"]);
  const skyLow = interpolateColors(frame, [0, 60, 110], ["#101728", "#7A3B49", "#E8945F"]);
  const dawn = interpolate(frame, [40, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const craneOpacity = interpolate(frame, [82, 94], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const towerWidthPct = 18;
  const floorHeightPct = 55 / TOTAL_FLOORS; // tower tops out at 55% of frame height

  return (
    <AbsoluteFill style={{ backgroundColor: palette.ink }}>
      <Drift from={1.05} to={1}>
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, ${skyTop} 0%, ${skyMid} 55%, ${skyLow} 100%)`,
      }} />
      <Starfield frame={frame} opacity={1 - dawn * 0.85} />
      <Glow x="50%" y="72%" size={1400} color="rgba(244,164,96,0.45)" opacity={dawn} />

      {/* Far skyline — hazy, slightly blurred for depth */}
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: "30%", filter: "blur(3px)", opacity: 0.7 }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", bottom: 0, left: `${i * 6.5}%`, width: "5%",
            height: `${30 + random(`far-h-${i}`) * 34}%`,
            backgroundColor: `rgba(16,24,42,${0.5 + random(`far-o-${i}`) * 0.2})`,
          }} />
        ))}
      </div>

      {/* Near skyline with scattered lit windows */}
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: "35%" }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const h = 34 + random(`near-h-${i}`) * 40;
          return (
            <div key={i} style={{
              position: "absolute", bottom: 0, left: `${i * 9 + 2}%`, width: "6%",
              height: `${h}%`,
              backgroundColor: `rgba(12,20,36,${0.75 + random(`near-o-${i}`) * 0.2})`,
            }}>
              {Array.from({ length: 6 }).map((_, w) =>
                random(`near-w-${i}-${w}`) < 0.4 ? (
                  <div key={w} style={{
                    position: "absolute",
                    left: `${12 + random(`near-wx-${i}-${w}`) * 66}%`,
                    top: `${10 + random(`near-wy-${i}-${w}`) * 75}%`,
                    width: 4, height: 6,
                    backgroundColor: "rgba(255,200,120,0.55)",
                  }} />
                ) : null
              )}
            </div>
          );
        })}
      </div>

      {/* The tower — floors stack bottom-up, windows light as crews move in */}
      <div style={{
        position: "absolute", bottom: "6%", left: "50%", transform: "translateX(-50%)",
        width: `${towerWidthPct}%`, height: `${floorCount * floorHeightPct}%`,
        display: "flex", flexDirection: "column-reverse",
        backgroundColor: "rgba(22,38,64,0.85)",
        border: "1px solid rgba(30,144,255,0.35)",
        boxShadow: "0 0 60px rgba(10,16,32,0.8)",
      }}>
        {Array.from({ length: floorCount }).map((_, i) => {
          const appearFrame = (90 * (i + 1)) / TOTAL_FLOORS;
          const weldFlash = interpolate(
            frame,
            [appearFrame, appearFrame + 5, appearFrame + 14],
            [0, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div key={i} style={{
              flex: 1,
              borderTop: "1px solid rgba(200,220,255,0.10)",
              background: weldFlash > 0 ? `rgba(103,232,249,${weldFlash * 0.5})` : undefined,
              display: "flex", alignItems: "center", justifyContent: "space-evenly",
            }}>
              {Array.from({ length: WINDOWS_PER_FLOOR }).map((_, w) => {
                const lit = random(`win-${i}-${w}`) < 0.35 + buildProgress * 0.25;
                return (
                  <div key={w} style={{
                    width: "8%", height: "42%",
                    backgroundColor: lit ? "rgba(255,214,140,0.7)" : "rgba(30,50,84,0.9)",
                    boxShadow: lit ? "0 0 6px rgba(255,214,140,0.5)" : undefined,
                  }} />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Tower crane — grounded beside the build, cable sways with the wind */}
      <div style={{
        position: "absolute", right: "34.5%", bottom: "6%", width: 5, height: "62%",
        opacity: craneOpacity,
      }}>
        {/* mast */}
        <div style={{ width: 5, height: "100%", backgroundColor: "#3A4150" }} />
        {/* jib + counter-jib */}
        <div style={{ position: "absolute", top: 0, left: -178, width: 268, height: 5, backgroundColor: "#464E5E" }} />
        {/* counterweight */}
        <div style={{ position: "absolute", top: 5, left: 74, width: 16, height: 26, backgroundColor: "#2C323E" }} />
        {/* cable + hook */}
        <div style={{
          position: "absolute", top: 5, left: -150,
          width: 1.5, height: 90 + Math.sin(frame * 0.12) * 10,
          backgroundColor: "rgba(210,220,235,0.5)",
        }} />
        <div style={{
          position: "absolute", top: 93 + Math.sin(frame * 0.12) * 10, left: -156,
          width: 14, height: 8, backgroundColor: "#4A5262",
        }} />
        {/* aviation light */}
        <div style={{
          position: "absolute", top: -6, left: -1, width: 7, height: 7, borderRadius: "50%",
          backgroundColor: "#FF5A5A",
          opacity: 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.18)),
          boxShadow: "0 0 8px rgba(255,90,90,0.9)",
        }} />
      </div>

      {/* Foreground ground haze seats the tower and skyline on a horizon */}
      <div style={{
        position: "absolute", bottom: 0, width: "100%", height: "14%",
        background: "linear-gradient(0deg, #070B14 30%, rgba(7,11,20,0.85) 60%, transparent 100%)",
      }} />
      </Drift>

      {/* Progress HUD — outside the drift so it stays locked to the frame */}
      <div style={{
        position: "absolute", bottom: 34, width: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        fontFamily: monoStack,
      }}>
        <div style={{ color: "rgba(232,238,248,0.75)", fontSize: 16, letterSpacing: 3 }}>
          CONSTRUCTION — FLOOR {floorCount} OF {TOTAL_FLOORS}
        </div>
        <div style={{
          width: 420, height: 5, borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.12)", overflow: "hidden",
        }}>
          <div style={{
            width: `${buildProgress * 100}%`, height: "100%",
            background: `linear-gradient(90deg, ${palette.azure}, ${palette.cyan})`,
            boxShadow: "0 0 12px rgba(103,232,249,0.8)",
          }} />
        </div>
        <div style={{ color: palette.cyan, fontSize: 13, letterSpacing: 2, opacity: 0.8 }}>
          {Math.round(buildProgress * 100)}% COMPLETE
        </div>
      </div>

      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — Completed. Sunrise glass tower: specular light sweep, twinkling
// occupancy, pulsing spire beacon.
// ---------------------------------------------------------------------------
const Completed: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const sunY = interpolate(frame, [0, 60], [230, 70], { extrapolateRight: "clamp" });
  const sweepX = interpolate(frame, [8, 78], [-140, 260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beaconPhase = (frame % 45) / 45;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #150A2E 0%, #4A1A3E 38%, #C25A3E 68%, #F0A468 100%)",
    }}>
      <Drift from={1} to={1.06}>
      {/* Sun with bloom */}
      <div style={{
        position: "absolute", top: sunY, left: "50%", transform: "translateX(-50%)",
        width: 150, height: 150, borderRadius: "50%",
        background: "radial-gradient(circle, #FFE0B0 0%, #F4A460 40%, rgba(212,106,62,0.6) 65%, transparent 75%)",
        boxShadow: "0 0 120px 40px rgba(244,164,96,0.5)",
        opacity: glow * 0.9,
      }} />
      <Glow x="50%" y="55%" size={1600} color="rgba(244,164,96,0.25)" opacity={glow} />

      {/* City silhouettes, two depths */}
      <div style={{ position: "absolute", bottom: "13%", width: "100%", height: "34%", filter: "blur(2px)", opacity: 0.75 }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", bottom: 0, left: `${i * 5.7}%`, width: "4.2%",
            height: `${14 + random(`c-far-${i}`) * 18}%`,
            backgroundColor: "rgba(34,26,48,0.7)",
          }} />
        ))}
      </div>
      <div style={{ position: "absolute", bottom: "15%", width: "100%", height: "40%" }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", bottom: 0, left: `${i * 7}%`, width: "5%",
            height: `${15 + random(`c-near-${i}`) * 20}%`,
            backgroundColor: "rgba(26,24,44,0.85)",
          }} />
        ))}
      </div>

      {/* Glass tower */}
      <div style={{
        position: "absolute", bottom: "15%", left: "50%", transform: "translateX(-50%)",
        width: "18%", height: "70%", overflow: "hidden",
        background: "linear-gradient(180deg, rgba(64,96,150,0.95), rgba(34,54,96,0.9))",
        border: "1px solid rgba(140,190,255,0.55)",
        boxShadow: `0 0 ${60 * glow}px rgba(103,180,255,${0.35 * glow}), inset 0 0 80px rgba(10,20,40,0.6)`,
      }}>
        {/* Floors with twinkling occupancy */}
        {Array.from({ length: TOTAL_FLOORS }).map((_, i) => {
          const phase = random(`twinkle-p-${i}`) * Math.PI * 2;
          const speed = 0.02 + random(`twinkle-v-${i}`) * 0.05;
          const litBase = random(`lit-${i}`);
          const shimmer = 0.5 + 0.5 * Math.sin(frame * speed + phase);
          return (
            <div key={i} style={{
              height: "2.5%",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              background: litBase < 0.45
                ? `rgba(255,214,150,${0.10 + shimmer * 0.18})`
                : "rgba(255,255,255,0.03)",
            }} />
          );
        })}
        {/* Sky reflection across the curtain wall */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(115deg, rgba(150,200,255,0.20) 0%, transparent 42%, rgba(14,22,44,0.30) 100%)",
        }} />
        {/* Vertical mullions give the curtain wall its window grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(90deg, transparent 0px, transparent 38px, rgba(8,16,32,0.45) 38px, rgba(8,16,32,0.45) 42px)",
        }} />
        {/* Specular sweep across the glass */}
        <div style={{
          position: "absolute", top: "-10%", bottom: "-10%",
          left: `${sweepX}%`, width: "45%",
          transform: "skewX(-18deg)",
          background: "linear-gradient(90deg, transparent, rgba(255,235,200,0.22) 50%, transparent)",
        }} />
      </div>

      {/* Spire + beacon */}
      <div style={{
        position: "absolute", bottom: "85%", left: "50%", transform: "translateX(-50%)",
        borderLeft: "10px solid transparent", borderRight: "10px solid transparent",
        borderBottom: `22px solid rgba(120,180,255,${0.75 * glow})`,
      }} />
      <div style={{
        position: "absolute", bottom: "86.8%", left: "50%",
        width: 8, height: 8, borderRadius: "50%", transform: "translateX(-50%)",
        backgroundColor: "#FFF2D8",
        boxShadow: "0 0 14px rgba(255,240,210,0.95)",
        opacity: glow,
      }} />
      <div style={{
        position: "absolute", bottom: "86.4%", left: "50%",
        width: 16, height: 16, borderRadius: "50%",
        transform: `translateX(-50%) scale(${1 + beaconPhase * 3})`,
        border: "1.5px solid rgba(255,240,210,0.8)",
        opacity: glow * (1 - beaconPhase),
      }} />
      </Drift>

      {/* Title card — locked to the frame */}
      <div style={{
        position: "absolute", bottom: 42, width: "100%", textAlign: "center",
        fontFamily: fontStack, opacity: glow,
      }}>
        <div style={{
          fontSize: 40, fontWeight: 800, letterSpacing: 12,
          background: "linear-gradient(90deg, #FFE8C8, #FFFFFF, #FFD9A8)",
          WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
        }}>
          THE PINNACLE
        </div>
        <div style={{
          marginTop: 8, color: "rgba(255,240,220,0.65)",
          fontSize: 15, letterSpacing: 6, fontFamily: monoStack,
        }}>
          COMPLETED — 380M · {TOTAL_FLOORS} FLOORS
        </div>
      </div>

      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Blueprint → construction → completed → blueprint reprise, joined by
// crossfades. Sequence durations minus the three 15-frame transitions
// sum to the composition's 300 frames.
// ---------------------------------------------------------------------------
const crossfade = () => (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

export const Skyscraper: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90}>
        <Blueprint />
      </TransitionSeries.Sequence>
      {crossfade()}
      <TransitionSeries.Sequence durationInFrames={120}>
        <Construction />
      </TransitionSeries.Sequence>
      {crossfade()}
      <TransitionSeries.Sequence durationInFrames={90}>
        <Completed />
      </TransitionSeries.Sequence>
      {crossfade()}
      <TransitionSeries.Sequence durationInFrames={45}>
        <Blueprint />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
