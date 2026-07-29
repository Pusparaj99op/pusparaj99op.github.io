# Design System: Pranay Gajbhiye — Portfolio

## 1. Visual Theme & Atmosphere
A restrained, editorial-studio interface — bold grotesk typography on a warm off-white canvas, styled after premium creative-agency sites (betteroff.studio). The atmosphere is confident and print-like: giant condensed headlines, generous whitespace, and scroll-driven letter reveals, but never loud or neon. Density stays airy (2/10) so the huge type has room to breathe. Layout variance is high (8/10) — asymmetric hero split, offset feature cards, zig-zag content blocks. Motion is fluid and scroll-scrubbed (7/10): GSAP + ScrollTrigger pinned word reveals, staggered word-by-word text entrances, Lenis-smoothed scroll — never bouncy or cartoonish.

## 2. Color Palette & Roles
- **Canvas Cream** (#EAE7DD) — Primary background surface
- **Canvas Cream Dim** (#E2DED1) — Secondary surface / alternating section background
- **Paper Card** (#F4F2E9) — Card and container fill
- **Ink** (#141310) — Primary text, headlines, accent (buttons, active states, focus) — doubles as the single accent since the palette is intentionally monochrome
- **Muted Graphite** (#6B675C) — Secondary text, captions, metadata, kicker labels
- **Deep Graphite** (#3A372F) — Tertiary text on lighter tints, list body copy
- **Whisper Border** (rgba(17,17,16,0.1)) — Card borders, 1px structural dividers
- **Hairline** (rgba(17,17,16,0.06)) — Subtle background grid lines, low-emphasis rules

No hue-based accent — Ink is the sole "accent," used at full strength for CTAs and at low opacity (0.02–0.15) for tints, dividers, and card fills. Never introduce a second hue. Never use pure black (`#000000`) — always Ink (#141310).

## 3. Typography Rules
- **Display/Headlines:** `Syne` (700/800) with `Cabinet Grotesk` (via Fontshare) as the premium fallback — track-tight (-0.02em to -0.04em), uppercase for giant statement type, tight leading (0.86–1.05). Hierarchy through size + weight, never gradient text.
- **Body:** `Inter` (300–600) — this is the one context where Inter is acceptable, strictly as the body/UI workhorse font, never for display headlines. Relaxed leading (1.6–1.7), max ~65 characters per line, Muted Graphite color.
- **Mono/Numbers:** Stat numbers and giant achievement figures use `Syne` display weight, not monospace — density here stays low (2/10), so the high-density monospace override does not apply.
- **Banned:** Inter for any display/headline role. Generic serifs (Times New Roman, Georgia, Garamond). If an editorial serif accent is ever wanted, only `Fraunces` or `Instrument Serif` — never in dashboard-style UI (this project has none).

## 4. Component Stylings
* **Buttons:** `.btn-accent` — solid Ink fill, Cream text, fully rounded (9999px), no outer glow; `.btn-ghost` — Ink outline, fill-wipe hover transition. Tactile scale (1.04) on hover via Framer Motion `MagneticElement`, no neon glow, no custom cursor.
* **Cards:** Numbered feature cards (`.numbered-card`) use a top border-hairline instead of elevation/shadow — betteroff's "(BO—01)" index pattern. Content cards (About terminal block, Companies ventures) use Paper Card fill + Whisper Border, generously rounded (12–16px), no drop shadow — flat, print-like.
* **Kicker labels:** `.kicker` — small dot bullet + uppercase 11px Inter, Muted Graphite, precedes every section headline (betteroff's "● CREATIVE AS IT SHOULD BE" pattern).
* **Inputs:** Floating-label pattern (`.floating-input`) — label rests inside the field at rest, floats up + shrinks to Ink on focus/fill. Border hairline, no shadow, generous 22px top padding.
* **Loaders:** Custom SVG line-draw wordmark reveal (`LoadingScreen`) on a Cream field — no generic spinner.
* **Scroll progress:** 1px Ink hairline fixed to viewport top, width-driven by scroll position.

## 5. Layout Principles
- Hero uses an asymmetric split (narrow kicker/CTA column + wide giant-type column), never centered — variance is 8/10.
- The signature moment is a full-width **pinned giant-word scroll reveal** (`PinnedWordReveal`): letters stagger in via ScrollTrigger scrub, one letter-slot swapped for an inline clipped image.
- Feature/venture cards use 2-up or numbered-list patterns, never a generic 3-equal-column row.
- Section max-width containment at ~1120–1320px, centered, with `clamp()`-driven side padding (`clamp(24px,5vw,64px)`).
- Full-height hero uses `100dvh`, not `100vh`.
- CSS Grid for the hero split and card grids; no flexbox percentage/`calc()` hacks.

## 6. Motion & Interaction
- GSAP + ScrollTrigger drives all scroll-linked reveals; Lenis provides the smoothed scroll substrate feeding ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.
- Word/line reveals (`SplitReveal`) stagger word-spans with `power4.out`/`power3.out` easing — spring-like weight, never linear or bouncy.
- The pinned-word hero reveal is scroll-scrubbed (`scrub: 0.6`), tying letter opacity/position directly to scroll position rather than a fire-once animation.
- Marquee strip (`MarqueeStrip`) runs a perpetual infinite loop, slowing/reversing on hover — the one "perpetual micro-interaction" element.
- Animate only `transform` and `opacity` — the grain-texture overlay is a fixed `::after` pseudo-element, isolated from layout.
- Stat counters and card lists reveal via staggered `whileInView` cascades (Framer Motion), never mounting instantly.

## 7. Anti-Patterns (Banned)
- No emojis anywhere in UI copy.
- No neon/purple glow shadows, no oversaturated accent hues — Ink is the only accent.
- No pure black (`#000000`) — always Ink (#141310).
- No gradient text on headlines.
- No custom mouse cursor (removed by design decision — native pointer only).
- No overlapping text/image elements — every element keeps its own spatial zone.
- No generic 3-equal-column card rows — use numbered cards, 2-up zig-zag, or list rows instead.
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen").
- No filler scroll affordances ("Scroll to explore", bouncing chevrons).
- No broken image links — placeholder imagery uses `picsum.photos` seeds.
- No centered hero layout (variance is 8/10 — asymmetric split only).
- No `Inter` used for display/headline type — reserved for body copy only.
