// Shared design tokens. Every composition draws from this palette and
// type system so the whole reel reads as one brand.

export const palette = {
  ink: "#04060C",
  night: "#070B16",
  navy: "#0A1020",
  blueprintBg: "#061024",
  azure: "#1E90FF",
  cyan: "#67E8F9",
  teal: "#34D399",
  amber: "#F59E0B",
  violet: "#8B5CF6",
  rose: "#EC4899",
  ember: "#FF6B6B",
  paper: "#E8E8E0",
  ivory: "#F7F6F2",
} as const;

export const fontStack =
  "'Inter', 'SF Pro Display', 'Segoe UI', system-ui, -apple-system, sans-serif";

export const monoStack =
  "'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace";

// Hairline used on cards and HUD chrome throughout.
export const hairline = "1px solid rgba(255,255,255,0.09)";
