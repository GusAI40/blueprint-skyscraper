import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DotGrid, Glow, Vignette } from "./fx";
import { fontStack, monoStack, palette } from "./theme";

type Agent = {
  id: string;
  name: string;
  role: string;
  color: string;
  x: number; // node center
  y: number;
};

// Centered across the 1920×1080 frame, with a gentle vertical rhythm.
const AGENTS: Agent[] = [
  { id: "R", name: "Receiver", role: "Intake & triage", color: "#67E8F9", x: 310, y: 560 },
  { id: "S", name: "Scout", role: "Research", color: "#34D399", x: 635, y: 470 },
  { id: "A", name: "Author", role: "Drafting", color: "#F59E0B", x: 960, y: 560 },
  { id: "D", name: "Designer", role: "Brand & layout", color: "#8B5CF6", x: 1285, y: 470 },
  { id: "C", name: "Courier", role: "Delivery", color: "#EC4899", x: 1610, y: 560 },
];

const CONNECTIONS: Array<[number, number]> = [[0, 1], [1, 2], [2, 3], [3, 4]];

const NODE_RADIUS = 46;
const PACKET_TRAVEL = 40; // frames for a packet to cross one hop
const PACKET_STAGGER = 34; // frames between hops starting

// Quadratic bézier helpers so packets ride exactly on the drawn curve.
const controlPoint = (a: Agent, b: Agent): { cx: number; cy: number } => ({
  cx: (a.x + b.x) / 2,
  cy: (a.y + b.y) / 2 + (a.y === b.y ? -70 : 0),
});

const pointOnCurve = (a: Agent, b: Agent, t: number) => {
  const { cx, cy } = controlPoint(a, b);
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * cx + t * t * b.x,
    y: u * u * a.y + 2 * u * t * cy + t * t * b.y,
  };
};

export const WorkflowVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeIn = spring({
    frame: Math.max(0, frame - 185),
    fps,
    config: { damping: 14 },
  });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${palette.ink} 0%, #070D1C 60%, ${palette.ink} 100%)` }}>
      <DotGrid color="#4A6A9A" opacity={0.12} />
      <Glow x="50%" y="50%" size={1500} color="rgba(30,60,120,0.28)" />
      <Glow x="15%" y="20%" size={800} color="rgba(103,232,249,0.07)" />
      <Glow x="85%" y="80%" size={800} color="rgba(139,92,246,0.07)" />

      {/* Title */}
      <div style={{
        position: "absolute", top: 90, left: 0, right: 0, textAlign: "center",
        fontFamily: fontStack,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <p style={{
          color: palette.cyan, fontSize: 16, fontWeight: 700, letterSpacing: "0.35em",
          textTransform: "uppercase", margin: 0, fontFamily: monoStack,
        }}>
          AI Workforce Pipeline
        </p>
        <p style={{
          fontSize: 46, fontWeight: 900, marginTop: 14, letterSpacing: "-0.01em",
          background: "linear-gradient(90deg, #E8E8E0, #9BD8EA)",
          WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
        }}>
          RFP → Signed Proposal in ~12 Minutes
        </p>
      </div>

      {/* Connection curves — dashes flow along the pipeline */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        {CONNECTIONS.map(([from, to], i) => {
          const a = AGENTS[from];
          const b = AGENTS[to];
          const { cx, cy } = controlPoint(a, b);
          const drawIn = interpolate(frame, [30 + i * 12, 55 + i * 12], [0, 0.55], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
              fill="none"
              stroke={b.color}
              strokeWidth={2}
              strokeDasharray="10 7"
              strokeDashoffset={-frame * 1.4}
              opacity={drawIn}
            />
          );
        })}
      </svg>

      {/* Data packets with comet trails */}
      {CONNECTIONS.map(([from, to], i) => {
        const a = AGENTS[from];
        const b = AGENTS[to];
        const start = 60 + i * PACKET_STAGGER;
        const t = interpolate(frame, [start, start + PACKET_TRAVEL], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (t <= 0 || t >= 1) {
          return null;
        }
        return (
          <React.Fragment key={`pkt-${i}`}>
            {[0, 0.06, 0.12].map((lag, gi) => {
              const tt = Math.max(0, t - lag);
              const p = pointOnCurve(a, b, tt);
              const size = gi === 0 ? 12 : gi === 1 ? 8 : 5;
              return (
                <div key={gi} style={{
                  position: "absolute",
                  left: p.x - size / 2, top: p.y - size / 2,
                  width: size, height: size, borderRadius: "50%",
                  background: b.color,
                  opacity: gi === 0 ? 1 : gi === 1 ? 0.45 : 0.2,
                  boxShadow: gi === 0 ? `0 0 16px ${b.color}` : undefined,
                }} />
              );
            })}
          </React.Fragment>
        );
      })}

      {/* Agent nodes */}
      {AGENTS.map((agent, i) => {
        const delay = i * 10;
        const scale = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12 } });
        // Node "receives" its packet when the previous hop completes.
        const arrival = i === 0 ? 30 : 60 + (i - 1) * PACKET_STAGGER + PACKET_TRAVEL;
        const pulse = interpolate(frame, [arrival, arrival + 8, arrival + 30], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div key={agent.id} style={{
            position: "absolute",
            left: agent.x, top: agent.y,
            transform: `translate(-50%, -50%) scale(${scale})`,
            opacity: scale,
          }}>
            {/* Pulse ring on packet arrival */}
            <div style={{
              position: "absolute", left: "50%", top: "50%",
              width: NODE_RADIUS * 2, height: NODE_RADIUS * 2,
              transform: `translate(-50%, -50%) scale(${1 + pulse * 0.9})`,
              borderRadius: "50%",
              border: `2px solid ${agent.color}`,
              opacity: pulse * 0.7,
            }} />
            {/* Ambient glow */}
            <div style={{
              position: "absolute", left: "50%", top: "50%",
              width: 190, height: 190, transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${agent.color}2E 0%, transparent 70%)`,
              opacity: 0.5 + pulse * 0.5,
            }} />
            {/* Glass disc */}
            <div style={{
              width: NODE_RADIUS * 2, height: NODE_RADIUS * 2, borderRadius: "50%",
              background: `linear-gradient(145deg, ${agent.color}52 0%, ${agent.color}14 55%, rgba(255,255,255,0.05) 100%)`,
              border: `1.5px solid ${agent.color}99`,
              boxShadow: `0 0 34px ${agent.color}40, inset 0 1px 1px rgba(255,255,255,0.35)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)",
            }}>
              <span style={{
                color: agent.color, fontSize: 32, fontWeight: 900, fontFamily: fontStack,
                textShadow: `0 0 18px ${agent.color}AA`,
              }}>{agent.id}</span>
            </div>
            {/* Name + role */}
            <div style={{
              position: "absolute", top: NODE_RADIUS * 2 + 16, left: "50%",
              transform: "translateX(-50%)", width: 190, textAlign: "center",
              fontFamily: fontStack,
              opacity: interpolate(frame, [delay + 18, delay + 32], [0, 1], { extrapolateRight: "clamp" }),
            }}>
              <p style={{
                color: palette.paper, fontSize: 20, fontWeight: 700, margin: 0,
                letterSpacing: "0.06em",
              }}>{agent.name}</p>
              <p style={{
                color: `${agent.color}C0`, fontSize: 13, margin: "6px 0 0",
                letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: monoStack,
              }}>{agent.role}</p>
            </div>
            {/* Step number chip */}
            <div style={{
              position: "absolute", top: -32, left: "50%", transform: "translateX(-50%)",
              padding: "3px 10px", borderRadius: 20,
              border: `1px solid ${agent.color}55`,
              color: `${agent.color}CC`, fontSize: 11, fontFamily: monoStack, letterSpacing: 2,
            }}>
              {`0${i + 1}`}
            </div>
          </div>
        );
      })}

      {/* Completion badge */}
      <div style={{
        position: "absolute", bottom: 130, left: "50%",
        transform: `translateX(-50%) translateY(${(1 - badgeIn) * 30}px)`,
        opacity: badgeIn,
        padding: "14px 34px", borderRadius: 40,
        border: "1px solid rgba(103,232,249,0.5)",
        background: "linear-gradient(90deg, rgba(103,232,249,0.10), rgba(52,211,153,0.10))",
        boxShadow: "0 0 40px rgba(103,232,249,0.18)",
        color: palette.cyan, fontFamily: monoStack, fontSize: 18, letterSpacing: 3,
      }}>
        ✓ SIGNED PROPOSAL DELIVERED — 11:42 ELAPSED
      </div>

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 56, left: 0, right: 0, textAlign: "center",
        fontFamily: fontStack,
        opacity: interpolate(frame, [140, 160], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <p style={{
          color: palette.cyan, fontSize: 15, fontWeight: 600,
          letterSpacing: "0.2em", textTransform: "uppercase", margin: 0,
        }}>
          TAG AI · Autonomous Workflows
        </p>
        <p style={{ color: "rgba(232,232,224,0.35)", fontSize: 13, marginTop: 8, letterSpacing: "0.05em" }}>
          Five specialists. One pipeline. Zero dropped balls.
        </p>
      </div>

      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};
