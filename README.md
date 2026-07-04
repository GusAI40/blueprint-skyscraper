# blueprint-skyscraper

Remotion video suite: a cinematic **blueprint → skyscraper** construction
time-lapse, plus three TAG AI marketing compositions. All animation is
deterministic (seeded randomness, frame-driven motion), so every render is
frame-for-frame reproducible.

## Compositions

| ID | Duration | Size | Description |
| --- | --- | --- | --- |
| `Skyscraper` | 10s (300f @ 30fps) | 1920×1080 | Blueprint draw-on → night-to-dawn construction time-lapse → sunrise glass tower, joined by crossfades |
| `ContentDay` | 6s (180f @ 30fps) | 1920×1080 | Studio shoot → website + social cards → delivery checklist close |
| `BeforeAfter` | 6s (180f @ 30fps) | 1920×1080 | Split-screen stat comparison with animated count-up (props-driven copy) |
| `WorkflowVisual` | 8s (240f @ 30fps) | 1920×1080 | Five-agent pipeline diagram with flowing packets and arrival pulses |

## Getting started

```bash
npm install
npm start          # opens Remotion Studio
```

## Rendering

```bash
npm run render               # Skyscraper → out/skyscraper.mp4
npm run render:content-day   # ContentDay → out/content-day.mp4
npm run render:before-after  # BeforeAfter → out/before-after.mp4
npm run render:workflow      # WorkflowVisual → out/workflow-visual.mp4
npm run render:all           # everything
```

Remotion downloads a matching Chrome Headless Shell on first render. To use
an existing binary instead, pass `--browser-executable=<path>` (the plain
Chromium binary no longer supports old headless mode; use a
`chrome-headless-shell` build).

## Quality gates

```bash
npm run lint       # ESLint with @remotion/eslint-config-flat
npm run typecheck  # strict TypeScript, no emit
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck, and a smoke render of
one frame from each composition on every push/PR.

## Project structure

```
src/
  index.ts                 # registerRoot entry point (see remotion.config.ts)
  Root.tsx                 # all <Composition> registrations
  theme.ts                 # shared palette + typography tokens
  fx.tsx                   # reusable effects (Vignette, Glow, Starfield, …)
  skyscraper/Skyscraper.tsx
  content-day/ContentDay.tsx
  BeforeAfter.tsx
  WorkflowVisual.tsx
```

### Animation ground rules

- Drive every animation from `useCurrentFrame()` — no CSS transitions or
  wall-clock timers (they flicker in parallel renders).
- Use `random(seed)` from `remotion`, never `Math.random()`, so layouts are
  stable across frames and machines.
- Composition durations must equal the sum of `TransitionSeries` sequence
  durations minus transition overlap.
