import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
} from "remotion";
import { dissolve } from "@remotion/transitions/dissolve";
import { vignette } from "@remotion/effects";

// Blueprint grid scene
const Blueprint: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  
  // Apply vignette for cinematic look
  const v = vignette({ frame, size: 0.4 });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a1628" }}>
      {/* Grid lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={`h${i}`} style={{
          position: "absolute", left: 0, top: `${(i/20)*100}%`,
          width: "100%", height: 1,
          backgroundColor: "rgba(30,144,255,0.15)"
        }} />
      ))}
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={`v${i}`} style={{
          position: "absolute", left: `${(i/30)*100}%`, top: 0,
          width: 1, height: "100%",
          backgroundColor: "rgba(30,144,255,0.15)"
        }} />
      ))}

      {/* Tower blueprint SVG */}
      <svg viewBox="0 0 400 800" style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%,-50%)", width: "40%", height: "80%"
      }}>
        <path d="M150,750 L150,250 L130,200 Q200,150 270,200 L250,250 L250,750 Z"
          fill="none" stroke="#1e90ff" strokeWidth="3" opacity={0.8} />
        <path d="M150,650 L250,650 M155,550 L245,550 M160,450 L240,450 M165,350 L235,350 M170,280 L230,280"
          fill="none" stroke="#1e90ff" strokeWidth="1.5" opacity={0.5} />
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={i} x1={150+i*3} y1={700-i*35} x2={250-i*3} y2={700-i*35}
            stroke="#1e90ff" strokeWidth="1" opacity={0.4} />
        ))}
        <text x="280" y="500" fill="#1e90ff" fontSize="12" opacity={0.6}>380m</text>
      </svg>

      <div style={{
        position: "absolute", bottom: 60, width: "100%", textAlign: "center",
        color: "#1e90ff", fontSize: 24, fontFamily: "monospace", letterSpacing: 4, opacity: 0.7
      }}>
        THE PINNACLE — ARCHITECTURAL VISION
      </div>
      {v}
    </AbsoluteFill>
  );
};

// Construction time-lapse
const Construction: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const buildProgress = interpolate(frame, [0, 90], [0, 1], { extrapolateRight: "clamp" });
  const towerHeight = buildProgress * (height * 0.75);
  const floorCount = Math.floor(buildProgress * 40);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0f1a" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 30%, #c75b39 60%, #f4a460 100%)",
        opacity: 0.6
      }} />

      {/* City skyline */}
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: "35%" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", bottom: 0, left: `${i*9+2}%`, width: "6%",
            height: `${20+Math.random()*25}%`,
            backgroundColor: `rgba(20,30,50,${0.4+Math.random()*0.3})`
          }} />
        ))}
      </div>

      {/* Tower */}
      <div style={{
        position: "absolute", bottom: "30%", left: "50%", transform: "translateX(-50%)",
        width: "18%", height: `${towerHeight}px`,
        backgroundColor: "rgba(30,60,100,0.8)", border: "2px solid rgba(30,144,255,0.3)",
        overflow: "hidden"
      }}>
        {Array.from({ length: floorCount }).map((_, i) => (
          <div key={i} style={{ height: `${towerHeight/floorCount}px`, borderBottom: "1px solid rgba(255,255,255,0.1)" }} />
        ))}
      </div>

      {/* Crane */}
      {buildProgress < 0.95 && (
        <div style={{ position: "absolute", right: "28%", top: "15%", transform: `translateY(${Math.sin(frame*0.1)*5}px)` }}>
          <div style={{ width: 4, height: 150, backgroundColor: "#444", margin: "0 auto" }} />
          <div style={{ width: 80, height: 4, backgroundColor: "#555", marginLeft: -40 }} />
        </div>
      )}

      <div style={{
        position: "absolute", bottom: 30, width: "100%", textAlign: "center",
        color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "monospace"
      }}>
        CONSTRUCTION — FLOOR {floorCount} OF 40
      </div>
    </AbsoluteFill>
  );
};

// Completed tower
const Completed: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const sunY = interpolate(frame, [0, 60], [200, 50], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #1a0a2e 0%, #4a1a3e 40%, #d46a3e 70%, #f4a460 100%)"
    }}>
      <div style={{
        position: "absolute", top: `${sunY}px`, left: "50%", transform: "translateX(-50%)",
        width: 120, height: 120, borderRadius: "50%",
        background: "radial-gradient(circle, #f4a460, #d46a3e, transparent)",
        opacity: glow * 0.8
      }} />

      <div style={{ position: "absolute", bottom: "15%", width: "100%", height: "40%" }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", bottom: 0, left: `${i*7}%`, width: "5%",
            height: `${15+Math.random()*20}%`, backgroundColor: "rgba(30,40,60,0.6)"
          }} />
        ))}
      </div>

      <div style={{
        position: "absolute", bottom: "15%", left: "50%", transform: "translateX(-50%)",
        width: "18%", height: "70%",
        background: "linear-gradient(180deg, rgba(50,80,130,0.9), rgba(30,50,90,0.8))",
        border: "2px solid rgba(30,144,255,0.5)",
        boxShadow: `0 0 ${40*glow}px rgba(30,144,255,${0.3*glow})`
      }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} style={{
            height: "2.5%", borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: i%3===0 ? "rgba(255,255,255,0.04)" : "transparent"
          }} />
        ))}
        <div style={{
          position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
          borderLeft: "10px solid transparent", borderRight: "10px solid transparent",
          borderBottom: `20px solid rgba(30,144,255,${0.7*glow})`
        }} />
      </div>

      <div style={{
        position: "absolute", bottom: 40, width: "100%", textAlign: "center",
        color: `rgba(255,255,255,${0.6*glow})`, fontSize: 20, fontFamily: "monospace", letterSpacing: 3
      }}>
        THE PINNACLE — COMPLETED
      </div>
    </AbsoluteFill>
  );
};

// Main composition with dissolve transitions
export const Skyscraper: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={90} name="Blueprint">
        <Blueprint />
      </Sequence>
      <Sequence from={75} durationInFrames={120} name="Construction">
        <Construction />
      </Sequence>
      <Sequence from={180} durationInFrames={90} name="Completed">
        <Completed />
      </Sequence>
      <Sequence from={255} durationInFrames={45} name="Blueprint">
        <Blueprint />
      </Sequence>
    </>
  );
};
