# AI image prompts

The main site (project pages + footer) and /tree share the code-drawn SVG covers in `public/covers/`. To try AI versions instead, paste a prompt below into ChatGPT, Gemini, Midjourney or a similar tool.

**Swapping covers in:** save each image as `public/covers/<slug>.webp` (16:9, about 1600×900), then change `.svg` to `.webp` in `getProjectCover()` in `src/data/projects.ts`. That updates every page at once.

Shared style suffix (append to every prompt):
> dark near-black background (#07090c), subtle grid texture, soft glow in the accent color, cinematic lighting, minimal, premium fintech aesthetic, no text, no logos, no watermark, 16:9

---

### nifty-option-trading-system — accent emerald #10b981
Abstract 3D visualization of an Indian stock index options trading terminal: rising emerald-green candlestick chart in the foreground, a glowing translucent option-chain grid floating behind it, fine data particles.

### binance-ethereum-option-algo — accent indigo #627eea (secondary Binance yellow #f0b90b)
A glossy glass Ethereum diamond crystal hovering above two intertwined flowing curves (one indigo, one yellow) representing delta hedging, faint Greeks symbols dissolving into light.

### tradeform — accent teal #0ea5e9
A sleek floating trading platform window in dark glass, a smooth teal equity curve rising inside it, backtest bars below, a subtle AI neural pattern reflected on the glass.

### black-scholes-on-bitcoin — accent orange #f7931a
A glowing orange wireframe implied-volatility surface (3D mesh) rising from the dark, a metallic Bitcoin coin half-embedded in the surface, mathematical elegance.

### crypto — accent violet #8b5cf6
A network of glowing violet nodes connected by thin light lines, representing multiple crypto exchanges, with small coin-like orbs flowing along the connections and a balanced portfolio feel.

### open-terminal — accent green #22c55e
A retro-futuristic floating terminal window with green monospace glow, a blinking block cursor, subtle CRT scanlines, and canvas pixels breaking apart into particles.

---

### BlackObsidian logo — square, 1:1
Minimal luxury logo mark for an asset management company named "BlackObsidian": a faceted black obsidian shard gemstone with thin champagne-gold (#c9a96e) edge highlights, centered inside a thin gold circle on pure black, vector-clean and flat, no text.
Save it as `public/tree/logos/blackobsidian.png`, then change the `logoUrl` in `tree-resume.tsx` to point to it.
