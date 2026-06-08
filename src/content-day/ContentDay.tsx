import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

// Scene 1: Camera shoot — bright studio feel
const CameraShoot: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const slide = spring({ frame, fps: 30, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)" }}>
      {/* Soft light beam */}
      <div style={{
        position: "absolute", top: -100, left: "20%",
        width: 400, height: 600,
        background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)",
        transform: "rotate(-15deg)"
      }} />

      {/* Camera operator silhouette */}
      <div style={{
        position: "absolute", left: "15%", top: "20%",
        transform: `translateY(${(1-slide)*50}px) scale(${0.95 + slide * 0.05})`,
        opacity: slide
      }}>
        <div style={{ width: 80, height: 60, background: "#2d3748", borderRadius: 8, position: "relative" }}>
          <div style={{ position: "absolute", top: -20, left: 15, width: 50, height: 30, background: "#4a5568", borderRadius: "8px 8px 0 0" }} />
          <div style={{ position: "absolute", top: -25, left: 30, width: 20, height: 8, background: "#38b2ce", borderRadius: 2 }} />
        </div>
      </div>

      {/* Photographer */}
      <div style={{
        position: "absolute", right: "20%", top: "15%",
        transform: `translateY(${(1-slide)*40}px)`,
        opacity: slide
      }}>
        <div style={{ width: 60, height: 50, background: "#2d3748", borderRadius: 6 }}>
          <div style={{ width: 40, height: 25, background: "#4a5568", borderRadius: "4px 4px 0 0", margin: "0 auto", marginTop: -20 }} />
        </div>
      </div>

      {/* Camera viewfinder frame */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: `translate(-50%,-50%) scale(${0.9 + slide * 0.1})`,
        width: 300, height: 200, border: "3px solid rgba(59,130,246,0.3)", borderRadius: 4,
        opacity: slide * 0.6
      }} />

      <div style={{
        position: "absolute", bottom: 50, width: "100%", textAlign: "center",
        color: "#4a5568", fontSize: 14, fontFamily: "system-ui", fontWeight: 500,
        opacity: slide
      }}>
        Premium Content Capture
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Website/social cards emerge
const WebsiteCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const slide = spring({ frame, fps: 30, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ background: "#ffffff" }}>
      {/* Subtle grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
        backgroundSize: "30px 30px", opacity: 0.4
      }} />

      {/* Website mockup */}
      <div style={{
        position: "absolute", left: "8%", top: "10%",
        width: "40%", height: "60%",
        background: "#f8f9fa", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        transform: `translateY(${(1-slide)*60}px)`,
        opacity: slide
      }}>
        {/* Header bar */}
        <div style={{ height: 12, background: "#3b82f6", borderRadius: "12px 12px 0 0", opacity: 0.3, margin: "10% 10% 0" }} />
        <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, margin: "8% 10% 0", width: "60%", opacity: 0.6 }} />
        <div style={{ height: 60, background: "#e2e8f0", borderRadius: 6, margin: "8% 10% 0", opacity: 0.5 }} />
        <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, margin: "8% 10% 0", width: "40%", opacity: 0.6 }} />
      </div>

      {/* Social cards */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", right: "8%", top: `${15 + i * 28}%`,
          width: "30%", height: "20%",
          background: i === 2 ? "#f8f9fa" : "#ffffff",
          borderRadius: 10, boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          border: i === 2 ? "1px solid #e2e8f0" : "none",
          transform: `translateX(${(1-slide)*(i+1)*30}px)`,
          opacity: slide * (1 - i * 0.25),
          transition: `all 0.3s`
        }}>
          <div style={{ height: "60%", background: i === 2 ? "#f1f5f9" : "#e8f0fe", borderRadius: "10px 10px 0 0", opacity: 0.4 + i * 0.2 }} />
          <div style={{ padding: "6% 8%", display: "flex", gap: "8%" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#cbd5e0", opacity: 0.5 }} />
            <div>
              <div style={{ height: 4, background: "#cbd5e0", borderRadius: 2, width: 60, marginBottom: 4, opacity: 0.5 }} />
              <div style={{ height: 3, background: "#e2e8f0", borderRadius: 2, width: 80, opacity: 0.5 }} />
            </div>
          </div>
        </div>
      ))}

      {/* Blue accent dot */}
      <div style={{
        position: "absolute", right: "5%", top: "85%",
        width: 8, height: 8, borderRadius: "50%", background: "#3b82f6",
        opacity: slide * 0.6
      }} />
    </AbsoluteFill>
  );
};

// Scene 3: Clean closing — premium business feel
const Premium: React.FC = () => {
  const frame = useCurrentFrame();
  const slide = spring({ frame, fps: 30, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ background: "#ffffff" }}>
      {/* Blue accent strip */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: "linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6)",
        transform: `scaleX(${slide})`, transformOrigin: "left"
      }} />

      {/* Central card */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: `translate(-50%,-50%) scale(${0.9 + slide * 0.1})`,
        width: "60%", maxWidth: 500, background: "#f8f9fa",
        borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
        padding: 40, textAlign: "center", opacity: slide
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, background: "#dbeafe",
          margin: "0 auto 16px",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ width: 20, height: 20, background: "#3b82f6", borderRadius: 4 }} />
        </div>
        <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3, width: "70%", margin: "0 auto 8px", opacity: 0.6 }} />
        <div style={{ height: 4, background: "#e2e8f0", borderRadius: 2, width: "50%", margin: "0 auto 4px", opacity: 0.6 }} />
        <div style={{ height: 4, background: "#e2e8f0", borderRadius: 2, width: "40%", margin: "0 auto", opacity: 0.6 }} />
      </div>
    </AbsoluteFill>
  );
};

export const ContentDay: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={60} name="Camera">
        <CameraShoot />
      </Sequence>
      <Sequence from={50} durationInFrames={80} name="Website">
        <WebsiteCards />
      </Sequence>
      <Sequence from={115} durationInFrames={65} name="Premium">
        <Premium />
      </Sequence>
    </>
  );
};
