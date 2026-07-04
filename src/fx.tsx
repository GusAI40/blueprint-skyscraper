import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Slow scale drift that gives static scenes a "camera on a dolly" feel.
// Wrap a scene's content; the scale runs over the scene's full duration.
export const Drift: React.FC<{
  from?: number;
  to?: number;
  children: React.ReactNode;
}> = ({ from = 1, to = 1.05, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [from, to]);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

// Darkened-corner overlay for a cinematic look. A plain CSS radial
// gradient renders identically in the studio, the player, and headless
// renders — no canvas support required.
export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0.55,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

// Large soft radial light source. Position with CSS percentage strings.
export const Glow: React.FC<{
  x: string;
  y: string;
  size: number;
  color: string;
  opacity?: number;
}> = ({ x, y, size, color, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

// Twinkling stars. Positions/phases come from remotion's seeded random()
// so every frame of every render is identical.
export const Starfield: React.FC<{
  frame: number;
  count?: number;
  seed?: string;
  opacity?: number;
  maxY?: number; // percent of height stars may occupy
}> = ({ frame, count = 70, seed = "stars", opacity = 1, maxY = 60 }) => (
  <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
    {Array.from({ length: count }).map((_, i) => {
      const x = random(`${seed}-x-${i}`) * 100;
      const y = random(`${seed}-y-${i}`) * maxY;
      const size = 1 + random(`${seed}-s-${i}`) * 2;
      const phase = random(`${seed}-p-${i}`) * Math.PI * 2;
      const speed = 0.04 + random(`${seed}-v-${i}`) * 0.08;
      const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(frame * speed + phase));
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: "#DDE8FF",
            opacity: twinkle,
            boxShadow: size > 2 ? "0 0 4px rgba(200,220,255,0.8)" : undefined,
          }}
        />
      );
    })}
  </div>
);

// Subtle engineering dot-grid backdrop.
export const DotGrid: React.FC<{ color?: string; opacity?: number }> = ({
  color = "#8899AA",
  opacity = 0.14,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
      backgroundSize: "36px 36px",
      opacity,
      pointerEvents: "none",
    }}
  />
);

// Corner brackets that frame a scene like a camera HUD.
export const HudCorners: React.FC<{
  color: string;
  inset?: number;
  size?: number;
  opacity?: number;
}> = ({ color, inset = 48, size = 42, opacity = 0.7 }) => {
  const corner = (styles: React.CSSProperties, borders: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        opacity,
        ...styles,
        ...borders,
      }}
    />
  );
  const b = `2px solid ${color}`;
  return (
    <>
      {corner({ left: inset, top: inset }, { borderLeft: b, borderTop: b })}
      {corner({ right: inset, top: inset }, { borderRight: b, borderTop: b })}
      {corner({ left: inset, bottom: inset }, { borderLeft: b, borderBottom: b })}
      {corner({ right: inset, bottom: inset }, { borderRight: b, borderBottom: b })}
    </>
  );
};
