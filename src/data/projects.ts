export type ProjectFeatureTag = 'Architecture' | 'Automation' | 'Interface' | 'Data';

export interface GalleryImage {
  seed: string;
  caption: string;
  tag: ProjectFeatureTag;
}

export interface Project {
  slug: string;
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  seed: string;
  github: string;
  live?: string;
  overview: string[];
  highlights: string[];
  gallery: GalleryImage[];
  role: string;
  year: string;
  stack: string[];
}

export const projects: Project[] = [
  {
    slug: 'nifty-option-trading-system',
    id: '01',
    title: 'Nifty Option Trading System',
    category: 'Algo Trading',
    description: 'Autonomous Nifty 50 derivative trading system with real-time options analysis and position management.',
    tags: ['Python', 'Dhan API', 'Options'],
    seed: 'nifty-terminal-charts',
    github: 'https://github.com/Pusparaj99op/NiftyOptionTradingSystem',
    overview: [
      'Nifty Option Trading System is an autonomous derivatives engine built to read, price, and act on Nifty 50 options without a human in the loop. It was designed for the volatility of Indian index options, where spreads move in single-digit seconds and stale data is worse than no data.',
      'The system streams live option-chain data through the Dhan API, reconstructs the implied volatility surface on every tick, and routes signals through a position manager that enforces hard risk limits before anything reaches the exchange.',
    ],
    highlights: [
      'Real-time option-chain ingestion with sub-second Greeks recalculation',
      'Position manager with hard stop-loss and exposure caps enforced pre-trade',
      'Backtested across three years of Nifty 50 expiry cycles',
      'Automatic square-off on expiry day volatility spikes',
    ],
    gallery: [
      { seed: 'nifty-terminal-charts', caption: 'Live option-chain terminal', tag: 'Interface' },
      { seed: 'nifty-architecture-flow', caption: 'Signal-to-execution pipeline', tag: 'Architecture' },
      { seed: 'nifty-risk-engine', caption: 'Pre-trade risk engine', tag: 'Automation' },
      { seed: 'nifty-volatility-surface', caption: 'Implied volatility surface', tag: 'Data' },
    ],
    role: 'Solo developer & quant',
    year: '2024',
    stack: ['Python', 'Dhan API', 'Pandas', 'NumPy', 'PostgreSQL'],
  },
  {
    slug: 'binance-ethereum-option-algo',
    id: '02',
    title: 'Binance Ethereum Option Algo',
    category: 'FinTech',
    description: 'Binance ETH options algorithm with dynamic hedging strategies and real-time Greeks calculation.',
    tags: ['Python', 'Binance API', 'Crypto'],
    seed: 'ethereum-dark-dashboard',
    github: 'https://github.com/Pusparaj99op/BinanceEthereumOptionAlgo',
    overview: [
      'A dynamic hedging algorithm for ETH options on Binance, built to keep a delta-neutral book through crypto’s sharper, less forgiving swings than traditional equity derivatives.',
      'The engine recalculates Greeks on every price update and rebalances the underlying hedge continuously, rather than on a fixed interval, to reduce slippage during fast moves.',
    ],
    highlights: [
      'Continuous delta-neutral rebalancing instead of fixed-interval hedging',
      'Custom Greeks engine tuned for crypto’s fatter volatility tails',
      'Exchange-native order routing with retry and fallback logic',
      'Position-level P&L attribution by Greek',
    ],
    gallery: [
      { seed: 'ethereum-dark-dashboard', caption: 'Hedging dashboard', tag: 'Interface' },
      { seed: 'ethereum-hedge-flow', caption: 'Delta-neutral rebalancing loop', tag: 'Automation' },
      { seed: 'ethereum-order-routing', caption: 'Order routing architecture', tag: 'Architecture' },
    ],
    role: 'Solo developer & quant',
    year: '2024',
    stack: ['Python', 'Binance API', 'AsyncIO', 'Redis'],
  },
  {
    slug: 'tradeform',
    id: '03',
    title: 'Tradeform',
    category: 'Full Stack',
    description: 'MetaTrader 5 integrated AI-powered trading platform with backtesting and live execution modules.',
    tags: ['Python', 'MT5', 'AI'],
    seed: 'tradeform-quant-desk',
    github: 'https://github.com/Pusparaj99op/Tradeform',
    overview: [
      'Tradeform bridges MetaTrader 5 with a modern web dashboard, giving discretionary and systematic traders one place to backtest a strategy, then flip it live without rewriting a single line.',
      'The platform exposes a shared strategy interface so a backtest and its live counterpart run the exact same code path, eliminating the usual gap between what was tested and what actually trades.',
    ],
    highlights: [
      'Shared strategy interface across backtest and live execution',
      'MT5 bridge with sub-100ms order acknowledgement',
      'Web dashboard for strategy configuration and monitoring',
      'AI-assisted parameter tuning from historical performance',
    ],
    gallery: [
      { seed: 'tradeform-quant-desk', caption: 'Strategy dashboard', tag: 'Interface' },
      { seed: 'tradeform-backtest-engine', caption: 'Backtest engine output', tag: 'Data' },
      { seed: 'tradeform-mt5-bridge', caption: 'MT5 execution bridge', tag: 'Architecture' },
    ],
    role: 'Solo developer',
    year: '2024',
    stack: ['Python', 'MetaTrader 5', 'FastAPI', 'React'],
  },
  {
    slug: 'black-scholes-on-bitcoin',
    id: '04',
    title: 'Black-Scholes on Bitcoin',
    category: 'Quant Finance',
    description: 'Black-Scholes-Merton model applied to Bitcoin options pricing with implied volatility surface.',
    tags: ['Python', 'BSM Model', 'Bitcoin'],
    seed: 'bitcoin-volatility-surface',
    github: 'https://github.com/Pusparaj99op',
    overview: [
      'An applied research project testing how far the classical Black-Scholes-Merton framework can be stretched to price Bitcoin options, where volatility clustering and fat tails break most of the model’s original assumptions.',
      'The output is a full implied volatility surface, rebuilt from live option quotes, used to flag where the market is over- or under-pricing tail risk relative to the model.',
    ],
    highlights: [
      'Full IV surface reconstruction from live BTC option quotes',
      'Skew and smile analysis versus traditional equity index options',
      'Model-versus-market mispricing flagged in real time',
      'Written up as a standalone research notebook',
    ],
    gallery: [
      { seed: 'bitcoin-volatility-surface', caption: 'Implied volatility surface', tag: 'Data' },
      { seed: 'bitcoin-skew-analysis', caption: 'Volatility skew analysis', tag: 'Data' },
    ],
    role: 'Independent research',
    year: '2023',
    stack: ['Python', 'NumPy', 'SciPy', 'Matplotlib'],
  },
  {
    slug: 'crypto',
    id: '05',
    title: 'CRYPTO',
    category: 'Algo Trading',
    description: 'Multi-exchange crypto algorithmic trading system with portfolio rebalancing and risk management.',
    tags: ['Python', 'Crypto', 'Risk'],
    seed: 'crypto-exchange-grid',
    github: 'https://github.com/Pusparaj99op/CRYPTO',
    overview: [
      'A multi-exchange trading system that treats liquidity as a portfolio problem, splitting orders across venues to reduce slippage and rebalancing exposure as prices diverge between them.',
      'Risk management runs as its own independent process, able to flatten every position across every exchange within seconds if a correlation break or exchange outage is detected.',
    ],
    highlights: [
      'Order splitting across multiple exchanges to minimise slippage',
      'Independent risk process with cross-exchange kill switch',
      'Automatic rebalancing on cross-venue price divergence',
      'Unified position ledger across five connected exchanges',
    ],
    gallery: [
      { seed: 'crypto-exchange-grid', caption: 'Multi-exchange order grid', tag: 'Interface' },
      { seed: 'crypto-risk-killswitch', caption: 'Cross-exchange kill switch', tag: 'Automation' },
      { seed: 'crypto-portfolio-ledger', caption: 'Unified position ledger', tag: 'Architecture' },
    ],
    role: 'Solo developer',
    year: '2023',
    stack: ['Python', 'CCXT', 'PostgreSQL', 'Docker'],
  },
  {
    slug: 'open-terminal',
    id: '06',
    title: 'Open Terminal',
    category: 'Full Stack',
    description: 'Web-based terminal emulator with real-time canvas rendering, command history, and custom shell.',
    tags: ['JavaScript', 'Canvas', 'GSAP'],
    seed: 'open-terminal-shell',
    github: 'https://github.com/Pusparaj99op',
    overview: [
      'Open Terminal is a browser-based terminal emulator rendered entirely on canvas, built to feel indistinguishable from a native shell down to cursor blink timing and scrollback behaviour.',
      'A custom shell layer parses and executes a working command set client-side, with GSAP driving the cursor, scroll, and window-chrome animation so the whole thing feels physically responsive rather than simulated.',
    ],
    highlights: [
      'Canvas-rendered terminal with native-feeling cursor and scrollback',
      'Custom shell parser supporting piping and command history',
      'GSAP-driven window chrome and cursor animation',
      'Zero backend dependency, runs fully client-side',
    ],
    gallery: [
      { seed: 'open-terminal-shell', caption: 'Canvas-rendered shell', tag: 'Interface' },
      { seed: 'open-terminal-render-loop', caption: 'Canvas render loop', tag: 'Architecture' },
    ],
    role: 'Solo developer',
    year: '2023',
    stack: ['JavaScript', 'Canvas API', 'GSAP'],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getRelatedProjects(slug: string, count = 3): Project[] {
  const others = projects.filter(p => p.slug !== slug);
  return others.slice(0, count);
}
