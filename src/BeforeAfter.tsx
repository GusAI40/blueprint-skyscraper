import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Glow, Vignette } from "./fx";
import { fontStack, monoStack, palette } from "./theme";

type Props = {
  beforeLabel: string;
  afterLabel: string;
  beforeStat: string;
  afterStat: string;
  resultText: string;
};

export const beforeAfterDefaultProps: Props = {
  beforeLabel: "12 Hours",
  afterLabel: "12 Minutes",
  beforeStat: "1 proposal",
  afterStat: "19 proposals",
  resultText: "The work gets done. You approve. You lead.",
};

// Split "19 proposals" into a countable number and its unit so the big
// numeral can tick up. Falls back to static text for non-numeric stats.
const splitStat = (stat: string): { value: number | null; unit: string } => {
  const match = /^(\d+)\s*(.*)$/.exec(stat.trim());
  if (!match) {
    return { value: null, unit: stat };
  }
  return { value: parseInt(match[1], 10), unit: match[2] };
};

const PARTICLES = 26;

export const BeforeAfter: React.FC<Props> = ({
  beforeLabel,
  afterLabel,
  beforeStat,
  afterStat,
  resultText,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const dividerReveal = spring({ frame, fps, config: { damping: 20 } });
  const leftSlide = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 15 } });
  const rightSlide = spring({ frame: Math.max(0, frame - 28), fps, config: { damping: 15 } });
  const statAppear = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const resultAppear = interpolate(frame, [120, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dividerPulse = 0.55 + 0.45 * Math.abs(Math.sin(frame * 0.08));

  const after = splitStat(afterStat);
  const countUp =
    after.value === null
      ? null
      : Math.round(
          interpolate(frame, [34, 84], [0, after.value], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        );
  const afterBig = countUp === null ? afterStat : `${countUp}`;
  const multiplier = after.value !== null && after.value > 1 ? `${after.value}×` : null;

  return (
    <AbsoluteFill style={{ background: palette.ink, fontFamily: fontStack }}>
      {/* ------------------------------- BEFORE ------------------------------ */}
      <div style={{
        position: "absolute", left: 0, top: 0, width: "50%", height: "100%",
        background: "linear-gradient(180deg, rgba(90,10,16,0.28) 0%, rgba(40,4,8,0.55) 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <Glow x="50%" y="30%" size={700} color="rgba(180,40,50,0.12)" />

        {/* Grinding backlog rows */}
        <div style={{ position: "absolute", top: "12%", width: "58%", opacity: leftSlide * 0.65 }}>
          {Array.from({ length: 4 }).map((_, i) => {
            const rowIn = interpolate(frame, [20 + i * 8, 34 + i * 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 18px", marginBottom: 10, borderRadius: 8,
                border: "1px solid rgba(255,107,107,0.18)",
                background: "rgba(60,10,14,0.35)",
                opacity: rowIn,
                transform: `translateX(${(1 - rowIn) * -30}px)`,
              }}>
                <div style={{
                  width: 9, height: 9, borderRadius: "50%",
                  backgroundColor: palette.ember, opacity: 0.8,
                }} />
                <div style={{
                  flex: 1, height: 7, borderRadius: 4,
                  background: "rgba(255,140,140,0.22)",
                  width: `${55 + random(`row-${i}`) * 35}%`,
                }} />
                <span style={{
                  color: "rgba(255,140,140,0.7)", fontSize: 12,
                  fontFamily: monoStack, letterSpacing: 1,
                }}>
                  OVERDUE
                </span>
              </div>
            );
          })}
        </div>

        <div style={{
          opacity: leftSlide, textAlign: "center",
          transform: `translateY(${(1 - leftSlide) * 40}px)`,
        }}>
          <p style={{
            color: palette.ember, fontSize: 19, fontWeight: 700, letterSpacing: "0.3em",
            textTransform: "uppercase", marginBottom: 24, fontFamily: monoStack,
          }}>Before</p>
          <p style={{
            color: "rgba(232,232,224,0.9)", fontSize: 110, fontWeight: 900,
            margin: 0, lineHeight: 1, letterSpacing: "-0.02em",
          }}>{beforeStat.split(" ")[0]}</p>
          <p style={{ color: "rgba(232,232,224,0.55)", fontSize: 30, marginTop: 10 }}>
            {beforeStat.split(" ").slice(1).join(" ") || " "}
          </p>
          <div style={{
            display: "inline-block", marginTop: 22, padding: "8px 22px", borderRadius: 24,
            border: "1px solid rgba(255,107,107,0.4)",
            color: "rgba(255,150,150,0.85)", fontSize: 19, fontFamily: monoStack, letterSpacing: 2,
          }}>
            {beforeLabel}
          </div>
        </div>
      </div>

      {/* ------------------------------- AFTER ------------------------------- */}
      <div style={{
        position: "absolute", right: 0, top: 0, width: "50%", height: "100%",
        background: "linear-gradient(180deg, rgba(0,80,140,0.14) 0%, rgba(0,120,100,0.20) 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <Glow x="50%" y="42%" size={900} color="rgba(103,232,249,0.14)" />

        {/* Rising light particles — all seeded, all frame-driven */}
        {Array.from({ length: PARTICLES }).map((_, i) => {
          const x = 6 + random(`px-${i}`) * 88;
          const speed = 0.9 + random(`pv-${i}`) * 1.6;
          const phase = random(`pp-${i}`) * height;
          const y = ((phase + frame * speed * 2.2) % (height * 1.1)) - height * 0.05;
          const size = 2 + random(`ps-${i}`) * 4;
          const glowP = random(`pg-${i}`) > 0.6;
          return (
            <div key={i} style={{
              position: "absolute", left: `${x}%`, bottom: y * 0.9,
              width: size, height: size, borderRadius: "50%",
              backgroundColor: glowP ? palette.cyan : "rgba(103,232,249,0.5)",
              boxShadow: glowP ? "0 0 8px rgba(103,232,249,0.8)" : undefined,
              opacity: rightSlide * (0.25 + random(`po-${i}`) * 0.55),
            }} />
          );
        })}

        <div style={{
          opacity: rightSlide, textAlign: "center",
          transform: `translateY(${(1 - rightSlide) * 40}px)`,
        }}>
          <p style={{
            color: palette.teal, fontSize: 19, fontWeight: 700, letterSpacing: "0.3em",
            textTransform: "uppercase", marginBottom: 24, fontFamily: monoStack,
          }}>After</p>
          <p style={{
            fontSize: 150, fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: "-0.02em",
            background: `linear-gradient(180deg, #B9F3FF, ${palette.cyan} 55%, ${palette.teal})`,
            WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
            textShadow: "0 0 60px rgba(103,232,249,0.35)",
          }}>{afterBig}</p>
          <p style={{ color: "rgba(103,232,249,0.85)", fontSize: 30, marginTop: 10 }}>
            {after.value === null ? " " : after.unit}
          </p>
          <div style={{
            display: "inline-block", marginTop: 22, padding: "8px 22px", borderRadius: 24,
            border: "1px solid rgba(103,232,249,0.5)",
            background: "rgba(103,232,249,0.07)",
            color: palette.cyan, fontSize: 19, fontFamily: monoStack, letterSpacing: 2,
            boxShadow: "0 0 24px rgba(103,232,249,0.15)",
          }}>
            {afterLabel}
          </div>
        </div>
      </div>

      {/* Center divider + medallion */}
      <div style={{
        position: "absolute", left: "50%", top: "14%", height: "72%", width: 2,
        transform: "translateX(-50%)",
        background: `linear-gradient(180deg, transparent, ${palette.cyan}, transparent)`,
        opacity: dividerReveal * dividerPulse,
        boxShadow: `0 0 ${18 * dividerPulse}px rgba(103,232,249,0.7)`,
      }} />
      <div style={{
        position: "absolute", left: "50%", top: "46%",
        transform: `translate(-50%, -50%) scale(${dividerReveal})`,
        width: 76, height: 76, borderRadius: "50%",
        background: "linear-gradient(145deg, rgba(20,32,50,0.95), rgba(8,14,24,0.95))",
        border: "1.5px solid rgba(103,232,249,0.6)",
        boxShadow: "0 0 34px rgba(103,232,249,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: palette.cyan, fontSize: 30, fontWeight: 900,
      }}>
        →
      </div>

      {/* Throughput callout */}
      {multiplier ? (
        <div style={{
          position: "absolute", bottom: 118, left: 0, right: 0, textAlign: "center",
          opacity: statAppear,
        }}>
          <p style={{
            fontSize: 44, fontWeight: 900, margin: 0,
            background: `linear-gradient(90deg, ${palette.cyan}, ${palette.teal})`,
            WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
          }}>
            {multiplier} throughput
          </p>
          <p style={{ color: "rgba(232,232,224,0.5)", fontSize: 21, marginTop: 8 }}>
            Same outcome. A fraction of the time.
          </p>
        </div>
      ) : null}

      {/* Result band */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "26px 40px 22px", textAlign: "center",
        background: "linear-gradient(0deg, rgba(4,6,12,0.97) 20%, transparent 100%)",
        opacity: resultAppear,
      }}>
        <p style={{ color: palette.paper, fontSize: 26, fontWeight: 600, margin: 0 }}>{resultText}</p>
        <p style={{
          color: palette.cyan, fontSize: 14, marginTop: 8,
          letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: monoStack,
        }}>
          TAG AI · ubntag.com
        </p>
      </div>

      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};
