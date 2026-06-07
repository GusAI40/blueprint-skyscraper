import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const AGENTS = [
  { id: "R", name: "Receiver", color: "#67E8F9", x: 100, y: 200 },
  { id: "S", name: "Scout", color: "#34D399", x: 380, y: 150 },
  { id: "A", name: "Author", color: "#F59E0B", x: 660, y: 200 },
  { id: "D", name: "Designer", color: "#8B5CF6", x: 940, y: 150 },
  { id: "C", name: "Courier", color: "#EC4899", x: 1220, y: 200 },
];

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
];

export const WorkflowVisual = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#05080D" }}>
      {/* Title */}
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <p style={{ color: "#67E8F9", fontSize: 14, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: 0 }}>
          AI Workforce Pipeline
        </p>
        <p style={{ color: "rgba(232,232,224,0.5)", fontSize: 28, fontWeight: 800, marginTop: 8 }}>
          RFP → Signed Proposal in ~12 Minutes
        </p>
      </div>

      {/* Agent nodes */}
      {AGENTS.map((agent, i) => {
        const delay = i * 10;
        const scale = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12 } });
        const glow = interpolate(frame, [delay + 30, delay + 45, delay + 60], [0, 1, 0], { extrapolateRight: "clamp" });

        return (
          <div key={agent.id} style={{
            position: "absolute",
            left: agent.x, top: agent.y,
            transform: `scale(${scale})`,
            opacity: scale,
          }}>
            {/* Glow ring */}
            <div style={{
              position: "absolute",
              left: -30, top: -30,
              width: 120, height: 120,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${agent.color}22 0%, transparent 70%)`,
              opacity: glow,
            }} />
            {/* Node */}
            <div style={{
              width: 60, height: 60,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${agent.color}44, ${agent.color}11)`,
              border: `2px solid ${agent.color}66`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 24px ${agent.color}33`,
            }}>
              <span style={{ color: agent.color, fontSize: 22, fontWeight: 900 }}>{agent.id}</span>
            </div>
            <p style={{
              color: "rgba(232,232,224,0.7)", fontSize: 12, fontWeight: 600,
              textAlign: "center", marginTop: 12, width: 100, marginLeft: -20,
              letterSpacing: "0.08em",
              opacity: interpolate(frame, [delay + 20, delay + 35], [0, 1], { extrapolateRight: "clamp" }),
            }}>{agent.name}</p>
          </div>
        );
      })}

      {/* Connection lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        {CONNECTIONS.map(([from, to], i) => {
          const x1 = AGENTS[from].x + 30;
          const y1 = AGENTS[from].y + 30;
          const x2 = AGENTS[to].x + 30;
          const y2 = AGENTS[to].y + 30;
          const delay = AGENTS[from].x / 30 + 40;
          const dashOffset = interpolate(frame, [delay, delay + 60], [200, 0], { extrapolateRight: "clamp" });

          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={AGENTS[to].color}
              strokeWidth={1.5}
              strokeDasharray="8 4"
              strokeDashoffset={dashOffset}
              opacity={0.4}
            />
          );
        })}
      </svg>

      {/* Data packets flowing */}
      {CONNECTIONS.map(([from, to], i) => {
        const x1 = AGENTS[from].x + 30;
        const y1 = AGENTS[from].y + 30;
        const x2 = AGENTS[to].x + 30;
        const y2 = AGENTS[to].y + 30;
        const delay = i * 30 + 60;
        const progress = interpolate(frame, [delay, delay + 30], [0, 1], { extrapolateRight: "clamp" });
        const px = x1 + (x2 - x1) * progress;
        const py = y1 + (y2 - y1) * progress;

        return (
          <div key={`pkt-${i}`} style={{
            position: "absolute",
            left: px - 3, top: py - 3,
            width: 6, height: 6,
            borderRadius: "50%",
            background: AGENTS[to].color,
            boxShadow: `0 0 8px ${AGENTS[to].color}88`,
            opacity: progress > 0 && progress < 1 ? 1 : 0,
          }} />
        );
      })}

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 50, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [140, 160], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <p style={{ color: "#67E8F9", fontSize: 14, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
          TAG AI · Autonomous Workflows
        </p>
        <p style={{ color: "rgba(232,232,224,0.3)", fontSize: 12, marginTop: 6 }}>
          Six specialists. One pipeline. Zero dropped balls.
        </p>
      </div>
    </AbsoluteFill>
  );
};
