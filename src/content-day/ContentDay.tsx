import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { fontStack, monoStack } from "../theme";

const BLUE = "#3B82F6";
const INK = "#1F2937";
const MUTED = "#64748B";

// ---------------------------------------------------------------------------
// Scene 1 — The shoot. A stylized studio: key light, camera rig, backdrop,
// live REC HUD.
// ---------------------------------------------------------------------------
const CameraShoot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame, fps, config: { damping: 20 } });
  const rigIn = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 16 } });
  const recOn = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #FBFAF7 0%, #F1EFEA 55%, #E9E6DF 100%)", fontFamily: fontStack }}>
      {/* Key light beam */}
      <div style={{
        position: "absolute", top: -160, left: "16%",
        width: 620, height: 900,
        background: "radial-gradient(ellipse, rgba(59,130,246,0.16) 0%, transparent 68%)",
        transform: "rotate(-16deg)",
        opacity: slide,
      }} />
      {/* Fill light from the right */}
      <div style={{
        position: "absolute", top: -100, right: "6%",
        width: 520, height: 760,
        background: "radial-gradient(ellipse, rgba(244,180,80,0.14) 0%, transparent 70%)",
        transform: "rotate(14deg)",
        opacity: slide,
      }} />

      {/* Backdrop roll with subject */}
      <div style={{
        position: "absolute", left: "54%", top: "20%", width: "26%", height: "54%",
        background: "linear-gradient(180deg, #FFFFFF 0%, #EFEDE8 100%)",
        borderRadius: 14,
        boxShadow: "0 18px 50px rgba(31,41,55,0.10)",
        opacity: slide,
        transform: `translateY(${(1 - slide) * 40}px)`,
        overflow: "hidden",
      }}>
        {/* Subject silhouette — head and shoulders */}
        <div style={{
          position: "absolute", bottom: -34, left: "50%", transform: "translateX(-50%)",
          width: 150, height: 110, borderRadius: "70px 70px 0 0", background: "#BDB6A9",
        }} />
        <div style={{
          position: "absolute", bottom: 88, left: "50%", transform: "translateX(-50%)",
          width: 58, height: 58, borderRadius: "50%", background: "#BDB6A9",
        }} />
      </div>
      {/* Backdrop support bar */}
      <div style={{
        position: "absolute", left: "52.5%", top: "18.5%", width: "29%", height: 14,
        background: "#D8D4CC", borderRadius: 7, opacity: slide,
      }} />

      {/* Camera rig */}
      <div style={{
        position: "absolute", left: "22%", top: "40%",
        opacity: rigIn,
        transform: `translateX(${(1 - rigIn) * -50}px)`,
      }}>
        {/* Body */}
        <div style={{
          width: 150, height: 96, background: INK, borderRadius: 12, position: "relative",
          boxShadow: "0 14px 34px rgba(31,41,55,0.28)",
        }}>
          {/* Lens with concentric elements */}
          <div style={{
            position: "absolute", right: -50, top: 16, width: 64, height: 64,
            borderRadius: "50%", background: "#111827",
            border: "5px solid #374151",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #6EA8FF 0%, #1D4ED8 45%, #0B1B45 100%)",
            }} />
          </div>
          {/* Viewfinder hump */}
          <div style={{
            position: "absolute", top: -22, left: 28, width: 62, height: 26,
            background: "#374151", borderRadius: "8px 8px 0 0",
          }} />
          {/* REC lamp */}
          <div style={{
            position: "absolute", top: 12, left: 14, display: "flex", alignItems: "center", gap: 7,
          }}>
            <div style={{
              width: 9, height: 9, borderRadius: "50%",
              background: "#EF4444", opacity: recOn ? 1 : 0.25,
              boxShadow: recOn ? "0 0 8px rgba(239,68,68,0.8)" : undefined,
            }} />
            <span style={{ color: "#F9FAFB", fontSize: 12, fontFamily: monoStack, letterSpacing: 2 }}>REC</span>
          </div>
        </div>
        {/* Tripod */}
        <div style={{ position: "relative", width: 150, height: 120 }}>
          <div style={{ position: "absolute", left: 71, top: 0, width: 8, height: 46, background: "#4B5563" }} />
          <div style={{ position: "absolute", left: 40, top: 40, width: 8, height: 84, background: "#4B5563", transform: "rotate(20deg)" }} />
          <div style={{ position: "absolute", left: 102, top: 40, width: 8, height: 84, background: "#4B5563", transform: "rotate(-20deg)" }} />
        </div>
      </div>

      {/* Framing guide locked on the subject */}
      <div style={{
        position: "absolute", left: "67%", top: "47%",
        transform: `translate(-50%,-50%) scale(${0.92 + slide * 0.08})`,
        width: 640, height: 440,
        border: "2px solid rgba(59,130,246,0.35)", borderRadius: 6,
        opacity: slide * 0.85,
      }}>
        {/* rule-of-thirds guides */}
        <div style={{ position: "absolute", left: "33.3%", top: 0, bottom: 0, width: 1, background: "rgba(59,130,246,0.12)" }} />
        <div style={{ position: "absolute", left: "66.6%", top: 0, bottom: 0, width: 1, background: "rgba(59,130,246,0.12)" }} />
        <div style={{ position: "absolute", top: "33.3%", left: 0, right: 0, height: 1, background: "rgba(59,130,246,0.12)" }} />
        <div style={{ position: "absolute", top: "66.6%", left: 0, right: 0, height: 1, background: "rgba(59,130,246,0.12)" }} />
      </div>

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 64, width: "100%", textAlign: "center", opacity: slide,
      }}>
        <p style={{
          color: BLUE, fontSize: 14, fontWeight: 700, letterSpacing: "0.3em",
          textTransform: "uppercase", margin: 0, fontFamily: monoStack,
        }}>
          On Set
        </p>
        <p style={{ color: INK, fontSize: 34, fontWeight: 800, margin: "10px 0 0", letterSpacing: "-0.01em" }}>
          Premium Content Capture
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — The assets ship. Browser mockup with a shimmering hero, floating
// social cards with live engagement.
// ---------------------------------------------------------------------------
const WebsiteCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame, fps, config: { damping: 15 } });
  const shimmerX = ((frame * 2.2) % 160) - 30;
  const likes = Math.round(interpolate(frame, [15, 70], [0, 1240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", fontFamily: fontStack }}>
      {/* Dot grid backdrop */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, #E2E8F0 1px, transparent 1px)",
        backgroundSize: "32px 32px", opacity: 0.5,
      }} />
      <div style={{
        position: "absolute", top: "-20%", left: "-10%", width: 900, height: 900,
        background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
      }} />

      {/* Browser mockup */}
      <div style={{
        position: "absolute", left: "7%", top: "12%",
        width: "44%", height: "64%",
        background: "#FFFFFF", borderRadius: 16,
        boxShadow: "0 24px 70px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.05)",
        border: "1px solid #EDF0F4",
        transform: `translateY(${(1 - slide) * 60}px)`,
        opacity: slide,
        overflow: "hidden",
      }}>
        {/* Chrome bar */}
        <div style={{
          height: 44, background: "#F8FAFC", borderBottom: "1px solid #EDF0F4",
          display: "flex", alignItems: "center", padding: "0 18px", gap: 8,
        }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FC5F57" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FDBC2E" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
          <div style={{
            marginLeft: 16, flex: 1, height: 22, borderRadius: 11, background: "#EEF2F7",
            display: "flex", alignItems: "center", paddingLeft: 12,
            color: "#94A3B8", fontSize: 11, fontFamily: monoStack,
          }}>
            ubntag.com
          </div>
        </div>
        {/* Hero with shimmer sweep */}
        <div style={{
          margin: "5% 6% 0", height: "42%", borderRadius: 10,
          background: "linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 60%, #E0F2FE 100%)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: `${shimmerX}%`, width: "26%",
            transform: "skewX(-18deg)",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)",
          }} />
          <div style={{
            position: "absolute", bottom: 16, left: 18, right: "40%",
            height: 12, borderRadius: 6, background: "rgba(30,64,175,0.28)",
          }} />
          <div style={{
            position: "absolute", bottom: 38, left: 18, right: "25%",
            height: 18, borderRadius: 9, background: "rgba(30,64,175,0.42)",
          }} />
        </div>
        {/* Copy skeleton */}
        <div style={{ padding: "5% 6%" }}>
          <div style={{ height: 10, width: "58%", borderRadius: 5, background: "#E2E8F0", marginBottom: 12 }} />
          <div style={{ height: 8, width: "92%", borderRadius: 4, background: "#EDF0F4", marginBottom: 8 }} />
          <div style={{ height: 8, width: "84%", borderRadius: 4, background: "#EDF0F4", marginBottom: 18 }} />
          <div style={{
            display: "inline-block", padding: "10px 26px", borderRadius: 10,
            background: BLUE, color: "#FFFFFF", fontSize: 14, fontWeight: 700,
            boxShadow: "0 8px 22px rgba(59,130,246,0.35)",
          }}>
            Book a shoot
          </div>
        </div>
      </div>

      {/* Social cards — staggered float */}
      {[0, 1, 2].map((i) => {
        const cardIn = spring({ frame: Math.max(0, frame - 10 - i * 9), fps, config: { damping: 14 } });
        const float = Math.sin(frame * 0.05 + i * 1.8) * 6;
        return (
          <div key={i} style={{
            position: "absolute", right: "7%", top: `${11 + i * 27}%`,
            width: "31%", height: "22%",
            background: "#FFFFFF", borderRadius: 14,
            boxShadow: "0 16px 44px rgba(15,23,42,0.08)",
            border: "1px solid #EDF0F4",
            transform: `translateX(${(1 - cardIn) * 120}px) translateY(${float}px)`,
            opacity: cardIn,
            overflow: "hidden",
          }}>
            <div style={{
              height: "56%",
              background: i === 0
                ? "linear-gradient(120deg, #BFDBFE, #E0F2FE)"
                : i === 1
                  ? "linear-gradient(120deg, #FDE68A, #FEF3C7)"
                  : "linear-gradient(120deg, #DDD6FE, #EDE9FE)",
            }} />
            <div style={{ padding: "3.5% 5%", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg, #3B82F6, #60A5FA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#FFF", fontSize: 13, fontWeight: 800,
              }}>
                T
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 7, width: "52%", borderRadius: 4, background: "#DDE3EA", marginBottom: 6 }} />
                <div style={{ height: 6, width: "74%", borderRadius: 3, background: "#EDF0F4" }} />
              </div>
              {i === 0 ? (
                <span style={{ color: MUTED, fontSize: 13, fontFamily: monoStack }}>
                  ♥ {likes.toLocaleString("en-US")}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 52, width: "100%", textAlign: "center",
        opacity: interpolate(frame, [24, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <p style={{
          color: BLUE, fontSize: 14, fontWeight: 700, letterSpacing: "0.3em",
          textTransform: "uppercase", margin: 0, fontFamily: monoStack,
        }}>
          Everywhere At Once
        </p>
        <p style={{ color: INK, fontSize: 30, fontWeight: 800, margin: "10px 0 0" }}>
          One shoot → website, social, ads
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — The close. A single confident brand card with a delivery
// checklist ticking off.
// ---------------------------------------------------------------------------
const CHECKLIST = ["Brand film delivered", "Site refresh live", "30 days of social queued"];

const Premium: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F6F8FB 100%)", fontFamily: fontStack }}>
      {/* Accent strip */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 5,
        background: "linear-gradient(90deg, #3B82F6, #60A5FA, #93C5FD, #3B82F6)",
        transform: `scaleX(${slide})`, transformOrigin: "left",
      }} />
      <div style={{
        position: "absolute", bottom: "-30%", right: "-12%", width: 900, height: 900,
        background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
      }} />

      {/* Central card */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: `translate(-50%,-50%) scale(${0.92 + slide * 0.08})`,
        width: 640,
        background: "rgba(255,255,255,0.9)",
        borderRadius: 22,
        border: "1px solid #EDF0F4",
        boxShadow: "0 30px 90px rgba(15,23,42,0.10), 0 4px 14px rgba(15,23,42,0.04)",
        padding: "52px 60px", textAlign: "center",
        opacity: slide,
        backdropFilter: "blur(6px)",
      }}>
        {/* Logo mark */}
        <div style={{
          width: 66, height: 66, borderRadius: 18, margin: "0 auto 22px",
          background: "linear-gradient(135deg, #3B82F6, #2563EB)",
          boxShadow: "0 12px 30px rgba(59,130,246,0.40)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#FFF", fontSize: 30, fontWeight: 900, letterSpacing: "-0.03em",
        }}>
          T
        </div>
        <p style={{ color: INK, fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>
          Content Day, Delivered
        </p>
        <p style={{ color: MUTED, fontSize: 17, margin: "10px 0 30px" }}>
          One day on set. A quarter of content in the can.
        </p>

        {/* Checklist */}
        <div style={{ textAlign: "left", display: "inline-block" }}>
          {CHECKLIST.map((item, i) => {
            const tick = spring({ frame: Math.max(0, frame - 16 - i * 9), fps, config: { damping: 13 } });
            return (
              <div key={item} style={{
                display: "flex", alignItems: "center", gap: 14, marginBottom: 14,
                opacity: tick, transform: `translateX(${(1 - tick) * 24}px)`,
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "linear-gradient(135deg, #34D399, #10B981)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#FFF", fontSize: 14, fontWeight: 900,
                  transform: `scale(${tick})`,
                  boxShadow: "0 6px 16px rgba(16,185,129,0.35)",
                }}>
                  ✓
                </div>
                <span style={{ color: INK, fontSize: 18, fontWeight: 600 }}>{item}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand footer */}
      <div style={{
        position: "absolute", bottom: 46, width: "100%", textAlign: "center",
        opacity: interpolate(frame, [26, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <p style={{
          color: BLUE, fontSize: 14, fontWeight: 700, margin: 0,
          letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: monoStack,
        }}>
          TAG AI · ubntag.com
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Three scenes joined by crossfades: 60 + 80 + 65 minus the 10- and
// 15-frame transitions equals the composition's 180 frames.
export const ContentDay: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={60}>
        <CameraShoot />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 10 })}
      />
      <TransitionSeries.Sequence durationInFrames={80}>
        <WebsiteCards />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={65}>
        <Premium />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
