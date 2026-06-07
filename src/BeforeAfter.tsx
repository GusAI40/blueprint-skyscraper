import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface Props {
  beforeLabel: string;
  afterLabel: string;
  beforeStat: string;
  afterStat: string;
  resultText: string;
}

export const BeforeAfter = ({ beforeLabel, afterLabel, beforeStat, afterStat, resultText }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation timing
  const dividerReveal = spring({ frame, fps, config: { damping: 20 } });
  const leftSlide = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 15 } });
  const rightSlide = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 15 } });
  const statAppear = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });
  const resultAppear = interpolate(frame, [120, 140], [0, 1], { extrapolateRight: "clamp" });
  const dividerX = interpolate(dividerReveal, [0, 1], [-100, 0]);

  return (
    <AbsoluteFill style={{ background: "#05080D", fontFamily: "system-ui, sans-serif" }}>
      {/* Left side - BEFORE */}
      <div style={{
        position: "absolute", left: 0, top: 0, width: "50%", height: "100%",
        background: "linear-gradient(180deg, rgba(139,0,0,0.15) 0%, rgba(80,0,0,0.3) 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        transform: `translateX(${dividerX}px)`,
      }}>
        <div style={{
          opacity: leftSlide,
          textAlign: "center",
          transform: `translateY(${(1 - leftSlide) * 40}px)`,
        }}>
          <p style={{ color: "#FF6B6B", fontSize: 18, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>Before</p>
          <p style={{ color: "#E8E8E0", fontSize: 72, fontWeight: 900, margin: 0, lineHeight: 1 }}>{beforeStat}</p>
          <p style={{ color: "rgba(232,232,224,0.4)", fontSize: 28, marginTop: 12 }}>{beforeLabel}</p>
        </div>
      </div>

      {/* Right side - AFTER */}
      <div style={{
        position: "absolute", right: 0, top: 0, width: "50%", height: "100%",
        background: "linear-gradient(180deg, rgba(0,102,255,0.08) 0%, rgba(0,180,150,0.12) 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          opacity: rightSlide,
          textAlign: "center",
          transform: `translateY(${(1 - rightSlide) * 40}px)`,
        }}>
          <p style={{ color: "#34D399", fontSize: 18, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>After</p>
          <p style={{ color: "#67E8F9", fontSize: 72, fontWeight: 900, margin: 0, lineHeight: 1, textShadow: "0 0 40px rgba(103,232,249,0.4)" }}>{afterStat}</p>
          <p style={{ color: "rgba(103,232,249,0.7)", fontSize: 28, marginTop: 12 }}>{afterLabel}</p>
        </div>
      </div>

      {/* Center divider line */}
      <div style={{
        position: "absolute", left: "50%", top: "20%", height: "60%",
        width: 2, background: "linear-gradient(180deg, transparent, #67E8F9, transparent)",
        transform: `translateX(${dividerX}px)`,
        opacity: dividerReveal,
      }} />

      {/* Bottom stat overlay */}
      <div style={{
        position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center",
        opacity: statAppear,
      }}>
        <p style={{ color: "#67E8F9", fontSize: 36, fontWeight: 800, margin: 0, textShadow: "0 0 24px rgba(103,232,249,0.5)" }}>
          {afterStat.split(" ")[0]}x throughput
        </p>
        <p style={{ color: "rgba(232,232,224,0.5)", fontSize: 20, marginTop: 8 }}>
          Same outcome. Fraction of the time.
        </p>
      </div>

      {/* Final result text */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, 
        padding: "20px 40px", textAlign: "center",
        background: "linear-gradient(0deg, rgba(5,8,13,0.95) 0%, transparent 100%)",
        opacity: resultAppear,
      }}>
        <p style={{ color: "#E8E8E0", fontSize: 24, fontWeight: 600, margin: 0 }}>{resultText}</p>
        <p style={{ color: "#67E8F9", fontSize: 14, marginTop: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          TAG AI · ubntag.com
        </p>
      </div>
    </AbsoluteFill>
  );
};
